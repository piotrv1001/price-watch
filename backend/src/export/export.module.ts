import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { FileSystemModule } from 'src/file-system/file-system.module';

@Module({
  imports: [FileSystemModule],
  providers: [ExportService],
  controllers: [ExportController],
})
export class ExportModule {}
