export class DeviceMessageDto {
  constructor(
    public readonly messagePattern: string,
    public readonly payload: any,
  ) {}
}
