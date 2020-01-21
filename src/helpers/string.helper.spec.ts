import { Test, TestingModule } from '@nestjs/testing';
import { StringHelper } from './string.helper';
import { ConfigService } from '../config/config.service';

describe('StringHelper', () => {
  let service: StringHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StringHelper,
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StringHelper>(StringHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return string of length input', async () => {
    const randomString = await service.generateRandomString(16);
    expect(randomString.length).toEqual(16);
  });

  it('should return hex color of given rgb color', async () => {
    expect(await service.rgbToHex(4, 150, 240)).toEqual('#0496f0');
  });

  it('should return hex color of given rgb color', async () => {
    expect(await service.rgbToHex(4, 7, 9)).toEqual('#040709');
  });

  it('should return hex color', async () => {
    expect(await service.generateRandomColor()).toMatch(/^([A-Fa-f0-9]{6})$/g);
  });

  it('should return hex color of given luminance', async () => {
    expect(await service.colorLuminance('#000', 0)).toEqual('000000');
  });

  it('should return random number', async () => {
    const randomNumber = await service.generateRandomNumber(6);
    expect(randomNumber.length).toEqual(6);
  });
});
