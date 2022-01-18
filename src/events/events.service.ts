import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Like } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private eventsRepo: EventsRepository) {}

  create(
    createEventDto: CreateEventDto,
    user: User,
    file: Express.Multer.File,
  ) {
    return this.eventsRepo.createEvent(createEventDto, user, file);
  }

  async findAll(keyword: string) {
    const query = this.eventsRepo.createQueryBuilder('event');

    if (keyword) {
      query.where(
        'LOWER(event.name) LIKE LOWER(:keyword) OR LOWER(event.venue) LIKE LOWER(:keyword) OR LOWER(event.description) LIKE LOWER(:keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    return await query.getMany();
  }

  async getMyEvents(user: User) {
    return await this.eventsRepo.find({ where: { user: user.id } });
  }

  async findOne(id: string) {
    const event = await this.eventsRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException();
    return event;
  }

  update(
    id: string,
    updateEventDto: UpdateEventDto,
    file: Express.Multer.File,
    user: User,
  ) {
    return this.eventsRepo.updateEvent(id, updateEventDto, file, user);
  }

  async remove(id: string, user: User) {
    const result = await this.eventsRepo.delete({ id, user: user });
    if (!result.affected) throw new NotFoundException();

    return { success: true };
  }
}
