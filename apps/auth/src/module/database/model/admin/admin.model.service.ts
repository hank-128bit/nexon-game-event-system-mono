import { BaseModelService } from '@libs/database/model/base.model';
import { Admin, AdminDocument } from '@libs/database/schemas/admin.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminModelService extends BaseModelService<AdminDocument> {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>
  ) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ email }).exec();
  }
}
