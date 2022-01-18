import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@EntityRepository(Event)
export class EventsRepository extends Repository<Event> {
  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Please upload event image');
    const { name, venue, description, date, time } = createEventDto;
    const event = await this.create({
      name,
      venue,
      description,
      date,
      time,
      image: `/uploads/${file.filename}`,
      user: user,
    });
    await this.save(event);

    return event;
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    file: Express.Multer.File,
    user: User,
  ) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException();
    if (event.user.id !== user.id) throw new ForbiddenException();

    event.name = updateEventDto.name || event.name;
    event.venue = updateEventDto.venue || event.venue;
    event.description = updateEventDto.description || event.description;
    event.date = updateEventDto.date || event.date;
    event.time = updateEventDto.time || event.time;

    if (file) {
      console.log(file);
      event.image = `/uploads/${file.filename}`;
    }

    await this.save(event);

    return event;
  }
}
