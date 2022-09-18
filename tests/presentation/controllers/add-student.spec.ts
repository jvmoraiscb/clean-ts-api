import { AddStudentUseCase } from "../../../src/domain/useCases"
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

class AddStudentController implements Controller<AddStudentUseCase.Props>{
    constructor(private readonly service: AddStudentUseCase) {}
    
    async handle(data: AddStudentUseCase.Props): Promise<HttpResponse> {
        const addedStudent = await this.service.add(data)
        return ok(addedStudent)
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
})