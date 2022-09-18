import { IdGenerator } from "../../../src/application/providers"

export class IdGeneratorMock implements IdGenerator{
    output = 'id_generator_out'
    generate(): string{
        return this.output
    }
}