import { StudentMinorError }    from "../../../src/domain/errors"
import { AddStudentUseCase }    from "../../../src/domain/useCases"
import { makeFakeStudentInput } from "../../application/mocks"

type HttpResponse = {
    statusCode: number
    body: any
}

interface Controller<T = any> {
    handle(data: T): Promise<HttpResponse>
}

class AddStudentServiceMock implements AddStudentUseCase{
    output: AddStudentUseCase.Result = {
        name: 'any_name',
        age: 20,
        id: 'any_id'
    }
    async add(student: AddStudentUseCase.Props): Promise<AddStudentUseCase.Result> {
        return this.output
    }
}

const ok = (data: any): HttpResponse => ({
    body: data,
    statusCode: 200
})

const badRequest = (error: Error): HttpResponse => ({
    body: error,
    statusCode: 400
})

const serverError = (error: Error): HttpResponse => ({
    body: error,
    statusCode: 500
})

class AddStudentController implements Controller<AddStudentUseCase.Props>{
    constructor(private readonly service: AddStudentUseCase) {}
    
    async handle(data: AddStudentUseCase.Props): Promise<HttpResponse> {
        try{
            const addedStudent = await this.service.add(data)
            return ok(addedStudent)
        } catch (error) {
            if(error instanceof StudentMinorError)
                return badRequest(error)
            return serverError(error)
        }
    }
}

type SutTypes = {
    sut: AddStudentController,
    serviceMock: AddStudentServiceMock
}

const makeSut = (): SutTypes => {
    const serviceMock = new AddStudentServiceMock()
    const sut = new AddStudentController(serviceMock)
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