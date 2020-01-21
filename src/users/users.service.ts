import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../schemas/user.schema';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { MeInterface } from './types/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) {}

  async findOneById(id: string, projection?: unknown): Promise<UserInterface> {
    try {
      return await this.userModel
        .findById(id)
        .select(projection)
        .lean();
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    }
  }

  async findOneByIdPopulated(id: string, projection?: unknown): Promise<MeInterface> {
    try {
      return await this.userModel
        .findById(id)
        .select(projection)
        .lean();
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    }
  }

  async getMe(userId: string): Promise<MeInterface> {
    return await this.findOneByIdPopulated(userId, {
      idps: 0,
      isShadow: 0,
      password: 0,
      __v: 0,
    });
  }

  async findOneWithoutPopulation(where): Promise<UserInterface> {
    try {
      return await this.userModel.findOne(where).lean();
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async findOne(where: unknown, projection?: unknown): Promise<UserInterface> {
    try {
      return await this.userModel
        .findOne(where)
        .select(projection)
        .lean();
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async findAll(where): Promise<UserInterface[]> {
    try {
      return await this.userModel.find(where).lean();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }

  async insertOne(user: UserInterface): Promise<UserInterface> {
    try {
      const docs = await this.userModel(user).save();
      return docs.toObject();
    } catch (e) {
      switch (e.code) {
        // throwing conflict http status code for duplicate email!
        case 11000:

        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async update(
    newValuesOfUser,
    where,
    options?: QueryFindOneAndUpdateOptionsInterface,
  ): Promise<QueryUpdateInterface> {
    try {
      return await this.userModel.updateMany(where, newValuesOfUser, options);
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    }
  }

  async findOneAndUpdateOne(
    newValuesOfUser,
    where,
    options?: QueryFindOneAndUpdateOptionsInterface,
  ): Promise<UserInterface | QueryUpdateInterface> {
    try {
      return await this.userModel.findOneAndUpdate(where, newValuesOfUser, options);
    } catch (e) {
      switch (e.code) {
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
