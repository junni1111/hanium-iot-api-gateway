export class SlaveStateDto {
  constructor(
    private readonly masterId: number,
    private readonly slaveId: number,
  ) {}
}
