import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { QueryDslQueryContainer, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import {
  ElasticSearchIndexNames,
  IGigPaginateProps,
  IGigSearchOptions,
  IGigSearchResult,
  ISellerGig
} from '@oybek703/freelance-app-shared'

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getGigById(gigId: string) {
    const isGigExists = await this.elasticsearchService.exists({ index: ElasticSearchIndexNames.gigs, id: gigId })
    if (!isGigExists) return { message: `Gig ${gigId} not found!` }
    return this.elasticsearchService.get<ISellerGig>({ index: ElasticSearchIndexNames.gigs, id: gigId })
  }

  async searchGigs(options: IGigPaginateProps, queryParams: IGigSearchOptions): Promise<IGigSearchResult> {
    const queryList: QueryDslQueryContainer[] = [
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
      queryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${queryParams.deliveryTime}*`
        }
      })

    if (!isNaN(parseInt(`${queryParams.min}`)) && !isNaN(parseInt(`${queryParams.max}`))) {
      queryList.push({
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
      query: { bool: { must: [...queryList] } }
    })

    let hits: ISellerGig[] = []
    for (const hit of gigs?.hits?.hits) {
      if (hit?._source) hits.push(hit._source)
    }

    return {
      total: +(gigs.hits.total as SearchTotalHits)?.value,
      hits
    }
  }
}
