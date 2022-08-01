import { MasterService } from '../master/master.service';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateSlaveDto } from '../dto/slave/create-slave.dto';
import { HttpService } from '@nestjs/axios';
import { SlaveStateDto } from '../dto/slave/slave-state.dto';

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
}
