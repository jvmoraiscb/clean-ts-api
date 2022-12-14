import { StudentMinorError }        from "../../../src/domain/errors"
import { AddStudentController }     from "../../../src/presentation/controllers"
import { Validator }                from "../../../src/presentation/protocols"
import { makeFakeStudentInput }     from "../../application/mocks"
import { AddStudentServiceMock }    from "../mocks"

type SutTypes = {
    sut: AddStudentController,
    serviceMock: AddStudentServiceMock
}

class ValidatorMock implements Validator {
    validate(input: any): Error {
        return null
    }
}

const makeSut = (): SutTypes => {
    const serviceMock = new AddStudentServiceMock()
    const validatorMock = new ValidatorMock()
    const sut = new AddStudentController(serviceMock, validatorMock)
    return {
        sut,
        serviceMock
    }
}

describe('add-student-controler', () => {
    it('should return student on success',async () => {
        const {sut, serviceMock} = makeSut()

        const httpResponse = await sut.handle(makeFakeStudentInput())

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toBe(serviceMock.output)
    })

    it('should return badRequest if service throws StudentMinorError',async () => {
        const {sut, serviceMock} = makeSut()
        serviceMock.add = () => { throw new StudentMinorError() }

        const httpResponse = await sut.handle(makeFakeStudentInput())

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new StudentMinorError())
    })

    it('should return serverError if service throws others errors',async () => {
        const {sut, serviceMock} = makeSut()
        serviceMock.add = () => { throw new Error('service error') }

        const httpResponse = await sut.handle(makeFakeStudentInput())

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error('service error'))
    })
})