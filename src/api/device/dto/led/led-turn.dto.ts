export class LedTurnDto {
  constructor(
    private readonly masterId: number,
    private readonly slaveId: number,
    private readonly powerState: string,
  ) {}
}
