import { LoggerService } from '@bird-cam/logger';
import { JanusEventsApiService } from '../infrastructure/janus-events-api.service';
import { JanusEventsService } from './janus-events.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JanusEvent } from '../model/janus-message.model';

describe('JanusEventsService', () => {
  let janusEventsApiService: JanusEventsApiService;
  let testUnit: JanusEventsService;

  const configServiceMock = {
    getOrThrow: () => 'birdcam',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        JanusEventsService,
        LoggerService,
        JanusEventsApiService,
      ],
    }).compile();

    janusEventsApiService = moduleRef.get<JanusEventsApiService>(
      JanusEventsApiService
    );
    testUnit = moduleRef.get<JanusEventsService>(JanusEventsService); 
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      testUnit.subscriberHasJoined.subscribe(() => console.log('Sarting Birdcam'));
      testUnit.subscriberHasLeft.subscribe(() => console.log('Stopping Birdcam'));

      janusEventsApiService.publishMessage({
        event: {
          data: {
            display: 'itsme',
            event: JanusEvent.Joined,
            id: 0,
          },
        },
      });
     
      janusEventsApiService.publishMessage({
        event: {
          data: {
            display: 'birdcam',
            event: JanusEvent.Joined,
            id: 1,
          },
        },
      });

      janusEventsApiService.publishMessage({
        event: {
          data: {
            event: JanusEvent.Leaving,
            id: 0,
          },
        },
      });

      janusEventsApiService.publishMessage({
        event: {
          data: {
            event: JanusEvent.Leaving,
            id: 1,
          },
        },
      });
      // const result = ['test'];
      // jest.spyOn(catsService, 'findAll').mockImplementation(() => result);
      // expect(await catsController.findAll()).toBe(result);
    });
  });
});
