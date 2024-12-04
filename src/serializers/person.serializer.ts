import { ApplicationFailure } from '@temporalio/client';
import { GenderEnum, IPerson } from '../interfaces';

export class PersonSerializer {
  public static fromAPI(result: { [P in keyof IPerson]: string & string[] }): IPerson {
    try {
      return {
        name: result.name,
        height: Number(result.height),
        mass: Number(result.mass),
        hair_color: result.hair_color,
        skin_color: result.skin_color,
        eye_color: result.eye_color,
        birth_year: result.birth_year, // Its not our calendar ;)
        gender: result.gender as GenderEnum,
        homeworld: result.homeworld,
        films: result.films,
        species: result.species,
        vehicles: result.vehicles,
        starships: result.starships,
        created: new Date(result.created),
        edited: new Date(result.edited),
        url: result.url,
      };
    } catch (e) {
      throw ApplicationFailure.create({
        message: `Failed to serialize ${JSON.stringify(result)}. Schema might be mismatched or API schema has changed.`,
        nonRetryable: true,
      });
    }
  }
}
