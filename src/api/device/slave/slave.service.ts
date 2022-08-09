import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MasterService } from '../master/master.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveStateDto } from './dto/slave-state.dto';
import { lastValueFrom } from 'rxjs';
import { SlaveStateResponse } from './response/slave-state.response';
import { AxiosResponse } from 'axios';
import { SlaveConfigResponse } from './response/slave-config.response';

@Injectable()
export class SlaveService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  createSlave(createSlaveDto: CreateSlaveDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('slave'),
        createSlaveDto,
      ),
    ).then((res) => res.data);
  }

  getSlaveConfigs(
    masterId: number,
    slaveId: number,
  ): Promise<SlaveConfigResponse> {
    return lastValueFrom(
      this.httpService.get(this.deviceMicroservice.requestUrl('slave/config'), {
        params: { masterId, slaveId },
      }),
    ).then((res: AxiosResponse<SlaveConfigResponse>) => res.data);
  }

  getSlaveState(slaveStateDto: SlaveStateDto): Promise<SlaveStateResponse> {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('slave/state'),
        slaveStateDto,
      ),
    ).then((res: AxiosResponse<SlaveStateResponse>) => res.data);
  }

  clearSlaveDB() {
    return lastValueFrom(
      this.httpService.delete(this.deviceMicroservice.requestUrl('slave/db')),
    ).then((res) => res.data);
  }
}
