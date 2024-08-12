import { BadRequestException, Injectable } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { IEducation, IExperience, Seller, SellerDocument } from '../schemas/seller.schema'
import { SellerDto } from '../dtos/seller.dto'
import { UsersCommonErrors } from '../shared/app.constants'
import { BuyerService } from './buyer.service'
import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'
import { floor, random, sample, sampleSize } from 'lodash'

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
    private readonly buyerService: BuyerService
  ) {}

  async getSellerById(sellerId: string) {
    const seller = await this.sellerModel.findOne<SellerDocument>({ _id: new mongoose.Types.ObjectId(sellerId) }).exec()
    return { message: 'Seller profile', seller }
  }

  async getSellerByUsername(username: string) {
    const seller = await this.sellerModel.findOne<SellerDocument>({ username }).exec()
    return { message: 'Seller profile', seller }
  }

  async getRandomSellers(size: number) {
    const sellers = await this.sellerModel.aggregate<SellerDocument[]>([{ $sample: { size } }])
    return { message: 'Random sellers profiles', sellers }
  }

  async createSeller(dto: SellerDto) {
    const existingSeller = await this.sellerModel.findOne<SellerDocument | null>({ where: { email: dto.email } }).exec()
    if (existingSeller) throw new BadRequestException(UsersCommonErrors.sellerAlreadyExists)
    const newSeller = await this.sellerModel.create(dto)
    await newSeller.save()
    await this.buyerService.updateIsSeller(newSeller.email)
    return newSeller
  }

  async updateSeller(dto: SellerDto, sellerId: string) {
    const updatedSeller = await this.sellerModel
      .findOneAndUpdate(
        { _id: sellerId },
        {
          $set: {
            profilePublicId: dto.profilePublicId,
            fullName: dto.fullName,
            profilePicture: dto.profilePicture,
            description: dto.description,
            country: dto.country,
            skills: dto.skills,
            oneliner: dto.oneliner,
            languages: dto.languages,
            responseTime: dto.responseTime,
            experience: dto.experience,
            education: dto.education,
            socialLinks: dto.socialLinks,
            certificates: dto.certificates
          }
        },
        { new: true }
      )
      .exec()
    return { message: 'Seller updated successfully.', seller: updatedSeller }
  }

  async getSellerByEmail(email: string) {
    return this.sellerModel.findOne({ email }).exec()
  }

  async seedSellers(count: number) {
    const buyers = await this.buyerService.getRandomBuyers(count)
    for (let i = 0; i < buyers.length; i++) {
      const buyer = buyers[i]
      const existingSeller = await this.getSellerByEmail(buyer.email)
      if (existingSeller) throw new BadRequestException(UsersCommonErrors.sellerAlreadyExists)
      const basicDescription: string = faker.commerce.productDescription()
      const skills: string[] = [
        'Programming',
        'Web development',
        'Mobile development',
        'Proof reading',
        'UI/UX',
        'Data Science',
        'Financial modeling',
        'Data analysis'
      ]
      const seller: SellerDto = {
        profilePublicId: uuid(),
        fullName: faker.person.fullName(),
        username: buyer.username,
        email: buyer.email,
        country: faker.location.country(),
        profilePicture: buyer.profilePicture,
        description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
        oneliner: faker.word.words({ count: { min: 5, max: 10 } }),
        skills: sampleSize(skills, sample([1, 4])),
        languages: [
          { language: 'English', level: 'Native' },
          { language: 'Spnish', level: 'Basic' },
          { language: 'German', level: 'Basic' }
        ],
        responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
        experience: this.randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
        education: this.randomEducations(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
        socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
        certificates: [
          {
            name: 'Flutter App Developer',
            from: 'Flutter Academy',
            year: '2021'
          },
          {
            name: 'Android App Developer',
            from: '2019',
            year: '2020'
          },
          {
            name: 'IOS App Developer',
            from: 'Apple Inc.',
            year: '2019'
          }
        ]
      }
      await this.createSeller(seller)
    }
  }

  randomExperiences(count: number) {
    const result: IExperience[] = []
    for (let i = 0; i < count; i++) {
      const randomStartYear = [2020, 2021, 2022, 2023, 2024, 2025]
      const randomEndYear = ['Present', '2024', '2025', '2026', '2027']
      const endYear = randomEndYear[floor(random(0.9) * randomEndYear.length)]
      const experience = {
        company: faker.company.name(),
        title: faker.person.jobTitle(),
        startDate: `${faker.date.month()} ${randomStartYear[floor(random(0.9) * randomStartYear.length)]}`,
        endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
        description: faker.commerce.productDescription().slice(0, 100),
        currentlyWorkingHere: endYear === 'Present'
      }
      result.push(experience)
    }
    return result
  }

  randomEducations(count: number) {
    const result: IEducation[] = []
    for (let i = 0; i < count; i++) {
      const randomYear = [2020, 2021, 2022, 2023, 2024, 2025]
      const education = {
        country: faker.location.country(),
        university: faker.person.jobTitle(),
        title: faker.person.jobTitle(),
        major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
        year: `${randomYear[floor(random(0.9) * randomYear.length)]}`
      }
      result.push(education)
    }
    return result
  }
}
