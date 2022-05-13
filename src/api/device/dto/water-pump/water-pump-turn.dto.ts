export class WaterPumpTurnDto {
  constructor(
    private readonly masterId: number,
    private readonly slaveId: number,
    private readonly powerState: string,
  ) {}
}
