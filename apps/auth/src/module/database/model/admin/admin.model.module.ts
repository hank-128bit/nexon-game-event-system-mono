import { Module } from '@nestjs/common';
import { AdminModelService } from './admin.model.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '@libs/database/schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [],
  providers: [AdminModelService],
  exports: [AdminModelService],
})
export class AdminModelModule {}
