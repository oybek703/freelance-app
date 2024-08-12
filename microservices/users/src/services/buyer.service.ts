import { BadRequestException, Injectable } from '@nestjs/common'
import { Buyer, BuyerDocument } from '../schemas/buyer.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { BuyerDto } from '../dtos/buyer.dto'
import { PurchasedGigsType, UsersCommonErrors } from '../shared/app.constants'

@Injectable()
export class BuyerService {
  constructor(@InjectModel(Buyer.name) private readonly buyerModel: Model<Buyer>) {}

  async getCurrentBuyerByEmail(email: string) {
    const buyer = await this.buyerModel.findOne<BuyerDocument>({ where: { email } }).exec()
    return { message: 'Buyer profile', buyer }
  }

  async getCurrentBuyerByUsername(username: string) {
    const buyer = await this.buyerModel.findOne<BuyerDocument>({ where: { username } }).exec()
    return { message: 'Buyer profile', buyer }
  }

  async getBuyerByUsername(username: string) {
    const buyer = await this.buyerModel.findOne<BuyerDocument>({ where: { username } }).exec()
    return { message: 'Buyer profile', buyer }
  }

  async createBuyer(dto: BuyerDto) {
    const existingBuyer = await this.buyerModel.findOne<BuyerDocument | null>({ where: { email: dto.email } }).exec()
    if (!existingBuyer) throw new BadRequestException(UsersCommonErrors.buyerAlreadyExists)
    await this.buyerModel.create(dto)
  }

  async getRandomBuyers(count: number) {
    return this.buyerModel.aggregate([{ $sample: { size: count } }]).exec()
  }

  async updateIsSeller(email: string) {
    await this.buyerModel.updateOne({ where: { email } }, { $set: { isSeller: true } }).exec()
  }

  async updateBuyerPurchasedGigs(buyerId: string, purchasedGigId: string, type: PurchasedGigsType) {
    // If a type is purchased-gigs, then add gigId to purchasedGigs
    if (type === PurchasedGigsType.purchasedGigs)
      await this.buyerModel.updateOne({ _id: buyerId }, { $push: { purchasedGigs: purchasedGigId } }).exec()

    // Otherwise, delete gigId from purchasedGigs
    await this.buyerModel.updateOne({ _id: buyerId }, { $pull: { purchasedGigs: purchasedGigId } }).exec()
  }
}
