import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MasterService } from '../master/master.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveStateDto } from './dto/slave-state.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SlaveService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('slave'),
        createSlaveDto,
      ),
    );
  }

  async getSlaveConfigs(masterId: number, slaveId: number) {
    return lastValueFrom(
      this.httpService.get(this.deviceMicroservice.requestUrl('slave/config'), {
        params: { masterId, slaveId },
      }),
    );
  }

  async getSlaveState(slaveStateDto: SlaveStateDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('slave/state'),
        slaveStateDto,
      ),
    );
  }

  async clearSlaveDB() {
    return lastValueFrom(
      this.httpService.delete(this.deviceMicroservice.requestUrl('slave/db')),
    );
  }
}
