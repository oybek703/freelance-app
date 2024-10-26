import { BadRequestException, Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import {
  ElasticSearchIndexNames,
  GigCacheCategoryKeys,
  IGigPaginateProps,
  IGigSearchOptions,
  isDataURL,
  ISellerGig,
  SellerUpdate,
  UpdateGig
} from '@oybek703/freelance-app-shared'
import { QueryDslQueryContainer, SearchResponse, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { v4 as uuid } from 'uuid'
import { CloudinaryService } from './cloudinary.service'
import { GigsCommonErrors } from '../shared/app.constants'
import { SellerUpdateProducer } from '../producers/seller-update.producer'
import { sample, sortBy } from 'lodash'
import { CachingService } from '../caching/caching.service'
import { faker } from '@faker-js/faker'
import { SeedGigsProducer } from '../producers/seed-gigs.producer'

@Injectable()
export class GigService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly gigProducer: SellerUpdateProducer,
    private readonly seedGigsProducer: SeedGigsProducer,
    private readonly cachingService: CachingService
  ) {}

  async getGigById(gigId: string) {
    const gigData = await this.elasticsearchService.get<ISellerGig>({ index: ElasticSearchIndexNames.gigs, id: gigId })
    return gigData._source
  }

  async getSellerGigs(sellerId: string, active: boolean) {
    const queryList: QueryDslQueryContainer[] = [
      {
        query_string: {
          fields: ['sellerId'],
          query: `*${sellerId}*`
        }
      },
      {
        term: {
          active
        }
      }
    ]
    const result: SearchResponse = await this.elasticsearchService.search({
      index: ElasticSearchIndexNames.gigs,
      query: {
        bool: {
          must: [...queryList]
        }
      }
    })
    const total = result.hits.total as SearchTotalHits
    return {
      total: total.value,
      hits: result.hits.hits
    }
  }

  async getSellerActiveGigs(sellerId: string) {
    const sellerActiveGigs = await this.getSellerGigs(sellerId, true)
    const gigs: ISellerGig[] = []
    for (const gig of sellerActiveGigs.hits) {
      if (gig._source) gigs.push(gig._source as ISellerGig)
    }
    return { message: 'Seller active gigs.', gigs }
  }

  async getSellerPausedGigs(sellerId: string) {
    const sellerActiveGigs = await this.getSellerGigs(sellerId, false)
    const gigs: ISellerGig[] = []
    for (const gig of sellerActiveGigs.hits) {
      if (gig._source) gigs.push(gig._source as ISellerGig)
    }
    return { message: 'Seller paused gigs.', gigs }
  }

  async getGigsCount() {
    const result = await this.elasticsearchService.count({ index: ElasticSearchIndexNames.gigs })
    return result.count
  }

  async createGig(gigDocument: ISellerGig) {
    const newGigId = uuid()
    const profilePublicId = uuid()
    const uploadResult = await this.cloudinaryService.uploadImage(gigDocument.profilePicture, {
      public_id: profilePublicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'auto'
    })
    if (!uploadResult.public_id) throw new BadRequestException(GigsCommonErrors.fileUploadError)
    const gigsCount = await this.getGigsCount()
    const updatedGigDocument = { ...gigDocument, sortId: gigsCount, coverImage: uploadResult?.secure_url }
    await this.elasticsearchService.index({
      index: ElasticSearchIndexNames.gigs,
      id: newGigId,
      document: updatedGigDocument
    })
    await this.gigProducer.publishSellerGigUpdate({
      type: SellerUpdate.SellerUpdatesTypes.updateGigCount,
      gigSellerId: updatedGigDocument.sellerId,
      count: 1
    })
    return { message: 'Gig created successfully.', gigId: newGigId }
  }

  async updateGig(gigId: string, gigDocument: ISellerGig) {
    const isDataUrl = isDataURL(gigDocument.coverImage)
    let coverImage = gigDocument.coverImage
    if (isDataUrl) {
      const uploadResult = await this.cloudinaryService.uploadImage(gigDocument.profilePicture, {
        overwrite: true,
        invalidate: true,
        resource_type: 'auto'
      })
      if (!uploadResult.public_id) throw new BadRequestException(GigsCommonErrors.fileUploadError)
      coverImage = uploadResult?.secure_url
    }
    const updatedGigDocument = {
      ...gigDocument,
      coverImage,
      title: gigDocument.title,
      description: gigDocument.description,
      categories: gigDocument.categories,
      subCategories: gigDocument.subCategories,
      tags: gigDocument.tags,
      price: gigDocument.price,
      expectedDelivery: gigDocument.expectedDelivery,
      basicTitle: gigDocument.basicTitle,
      basicDescription: gigDocument.basicDescription
    }
    await this.elasticsearchService.update({
      index: ElasticSearchIndexNames.gigs,
      id: gigId,
      doc: updatedGigDocument
    })
    return { message: 'Gig updated successfully.', gigId }
  }

  async updateGigActiveProp(gigId: string, gigDocument: ISellerGig) {
    await this.elasticsearchService.update({
      index: ElasticSearchIndexNames.gigs,
      id: gigId,
      doc: gigDocument
    })
    return { message: 'Gig active prop updated successfully.', gigId }
  }

  async deleteGig(gigId: string, sellerId: string) {
    await this.elasticsearchService.delete({
      index: ElasticSearchIndexNames.gigs,
      id: gigId
    })
    await this.gigProducer.publishSellerGigUpdate({
      type: SellerUpdate.SellerUpdatesTypes.updateGigCount,
      gigSellerId: sellerId,
      count: -1
    })
    return { message: 'Gig deleted successfully.' }
  }

  async updateGigReview(gigId: string, data: UpdateGig.Request) {
    const ratingTypes = {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five'
    }
    const gigDocument = await this.getGigById(gigId)
    const ratingKey: string = ratingTypes[`${data.rating}`]
    const updatedGigDocument: ISellerGig = {
      ...gigDocument,
      ratingsCount: gigDocument.ratingsCount + 1,
      ratingSum: gigDocument.ratingSum + data.rating,
      [`ratingCategories.${ratingKey}.value`]: gigDocument[`ratingCategories.${ratingKey}.value`] + data.rating,
      [`ratingCategories.${ratingKey}.count`]: gigDocument[`ratingCategories.${ratingKey}.count`] + 1
    }
    await this.elasticsearchService.update({
      index: ElasticSearchIndexNames.gigs,
      id: gigId,
      doc: updatedGigDocument
    })
  }

  async searchGigs(options: IGigPaginateProps, queryParams: IGigSearchOptions) {
    const searchQueryList: QueryDslQueryContainer[] = [
      {
        query_string: {
          fields: [
            'username',
            'title',
            'description',
            'basicDescription',
            'basicTitle',
            'categories',
            'subCategories',
            'tags'
          ],
          query: `*${queryParams.query}*`
        }
      },
      {
        term: {
          active: true
        }
      }
    ]

    if (queryParams.deliveryTime !== undefined)
      searchQueryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${queryParams.deliveryTime}*`
        }
      })

    if (!isNaN(parseInt(`${queryParams.min}`)) && !isNaN(parseInt(`${queryParams.max}`))) {
      searchQueryList.push({
        range: {
          price: {
            gte: queryParams.min,
            lte: queryParams.max
          }
        }
      })
    }

    const gigs = await this.elasticsearchService.search<ISellerGig>({
      index: ElasticSearchIndexNames.gigs,
      size: +options?.size,
      ...(options.from !== '0' && { search_after: [options.from] }),
      sort: [
        {
          sortId: options.type === 'forward' ? 'asc' : 'desc'
        }
      ],
      query: { bool: { must: [...searchQueryList] } }
    })

    let hits: ISellerGig[] = []
    for (const hit of gigs?.hits?.hits) {
      if (hit?._source) hits.push(hit._source)
    }

    if (options.type === 'backward') {
      hits = sortBy(hits, ['sortId'])
    }

    return {
      total: +(gigs.hits.total as SearchTotalHits)?.value,
      gigs: hits
    }
  }

  async getGigsByCategory(username: string) {
    const userSelectedCategory = await this.cachingService.getValueFromCache(
      `${GigCacheCategoryKeys.selectedCategories}:${username}`
    )
    const result: SearchResponse = await this.elasticsearchService.search<ISellerGig>({
      index: ElasticSearchIndexNames.gigs,
      size: 10,
      query: {
        bool: {
          must: [
            {
              query_string: {
                fields: ['categories'],
                query: `*${userSelectedCategory}*`
              }
            },
            {
              term: {
                active: true
              }
            }
          ]
        }
      }
    })
    const total = result.hits.total as SearchTotalHits
    const gigs: ISellerGig[] = []
    for (const item of result.hits.hits) {
      gigs.push(item._source as ISellerGig)
    }
    return { total: total.value, gigs }
  }

  async getTopGigsByCategory(username: string) {
    const userSelectedCategory = await this.cachingService.getValueFromCache(
      `${GigCacheCategoryKeys.selectedCategories}:${username}`
    )
    const result: SearchResponse = await this.elasticsearchService.search({
      index: ElasticSearchIndexNames.gigs,
      size: 10,
      query: {
        bool: {
          filter: {
            script: {
              script: {
                source:
                  "doc['ratingSum'].value != 0 && (doc['ratingSum'].value / doc['ratingsCount'].value == params['threshold'])",
                lang: 'painless',
                params: {
                  threshold: 5
                }
              }
            }
          },
          must: [
            {
              query_string: {
                fields: ['categories'],
                query: `*${userSelectedCategory}*`
              }
            }
          ]
        }
      }
    })
    const total = result.hits.total as SearchTotalHits
    const gigs: ISellerGig[] = []
    for (const item of result.hits.hits) {
      gigs.push(item._source as ISellerGig)
    }
    return { total: total.value, gigs }
  }

  async getGigsMoreLikeThis(gigId: string) {
    const result: SearchResponse = await this.elasticsearchService.search({
      index: ElasticSearchIndexNames.gigs,
      size: 5,
      query: {
        more_like_this: {
          fields: [
            'username',
            'title',
            'description',
            'basicDescription',
            'basicTitle',
            'categories',
            'subCategories',
            'tags'
          ],
          like: [
            {
              _index: ElasticSearchIndexNames.gigs,
              _id: gigId
            }
          ]
        }
      }
    })
    const total = result.hits.total as SearchTotalHits
    const gigs: ISellerGig[] = []
    for (const item of result.hits.hits) {
      gigs.push(item._source as ISellerGig)
    }
    return { total: total.value, gigs }
  }

  async seedData(sellers: unknown[], count: number) {
    const categories: string[] = [
      'Graphics & Design',
      'Digital Marketing',
      'Writing & Translation',
      'Video & Animation',
      'Music & Audio',
      'Programming & Tech',
      'Data',
      'Business'
    ]
    const expectedDelivery: string[] = [
      '1 Day Delivery',
      '2 Days Delivery',
      '3 Days Delivery',
      '4 Days Delivery',
      '5 Days Delivery'
    ]
    const randomRatings = [
      { sum: 20, count: 4 },
      { sum: 10, count: 2 },
      { sum: 20, count: 4 },
      { sum: 15, count: 3 },
      { sum: 5, count: 1 }
    ]

    for (let i = 0; i < sellers.length; i++) {
      const sellerDoc = sellers[i]
      const title = `I will ${faker.word.words(5)}`
      const basicTitle = faker.commerce.productName()
      const basicDescription = faker.commerce.productDescription()
      const rating = sample(randomRatings)
      const gig = {
        profilePicture: sellerDoc['profilePicture'],
        sellerId: sellerDoc['_id'],
        email: sellerDoc['email'],
        username: sellerDoc['username'],
        title: title.length <= 80 ? title : title.slice(0, 80),
        basicTitle: basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
        basicDescription: basicDescription.length <= 100 ? basicDescription : basicDescription.slice(0, 100),
        categories: `${sample(categories)}`,
        subCategories: [faker.commerce.department(), faker.commerce.department(), faker.commerce.department()],
        description: faker.lorem.sentences({ min: 2, max: 4 }),
        tags: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
        price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
        coverImage: faker.image.urlPicsumPhotos(),
        expectedDelivery: `${sample(expectedDelivery)}`,
        sortId: parseInt(String(count), 10) + i + 1,
        ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
        ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0
      }
      console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`)
      const gigId = uuid()
      const updatedGigDocument: ISellerGig = {
        active: true,
        createdAt: new Date().toDateString(),
        ratingCategories: undefined,
        ...gig,
        id: gigId
      }
      await this.elasticsearchService.index({
        index: ElasticSearchIndexNames.gigs,
        id: gigId,
        document: updatedGigDocument
      })
    }
  }

  async seedGigs(count: number) {
    await this.seedGigsProducer.publishGetSellers({ count })
    return { message: 'Seed gigs sent to users service.' }
  }
}
