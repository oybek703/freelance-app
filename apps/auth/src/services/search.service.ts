import { Injectable, Logger } from '@nestjs/common'
import { GigsIndexName } from '../shared/app.constants'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { IGigPaginateProps, IGigSearchOptions, IGigSearchResult } from '@freelance-app/interfaces'
import { QueryDslQueryContainer, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getGigById(gigId: string) {
    const isGigExists = await this.elasticsearchService.exists({ index: GigsIndexName, id: gigId })
    if (!isGigExists) return { message: `Gig ${gigId} not found!` }
    return this.elasticsearchService.get({ index: GigsIndexName, id: gigId })
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

    if (queryParams.deliveryTime !== undefined) {
      queryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${queryParams.deliveryTime}*`
        }
      })
    }

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

    const gigs = await this.elasticsearchService.search({
      index: GigsIndexName,
      size: +options?.size,
      ...(options.from !== '0' && { search_after: [options.from] }),
      sort: [
        {
          sortId: options.type === 'forward' ? 'asc' : 'desc'
        }
      ],
      query: { bool: { must: [...queryList] } }
    })

    let hits = []
    for (const hit of gigs?.hits?.hits) {
      if (hit?._source) hits.push(hit._source)
    }

    return {
      total: +(gigs.hits.total as SearchTotalHits)?.value,
      hits
    }
  }
}
