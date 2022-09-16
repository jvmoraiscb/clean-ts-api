type Student = {
    id: string
    name: string
    age: number
    password: string
}

type AddStudentInputDTO = Omit<Student, 'id'>
/*
type AddStudentInputDTO = {
    name: string
    age: number
    password: string
}
*/


interface AddStudentUseCase{
    add(student: Student):Promise<Student>
}
interface AddStudentRepository{
    add(student: Student):Promise<Student>
}
interface Encrypter{
    encrypt(plainText: string): string
}

class EncrypterMock implements Encrypter{
    input = ''
    output = 'encrypter output'
    
    encrypt(plainText: string): string{
        this.input = plainText
        return this.output
    }
}

class AddStudentRepositoryMock implements AddStudentRepository{
    input = null
    async add(student: Student): Promise<Student> {
        this.input = student
        return null
    }
}

class AddStudentService implements AddStudentUseCase {
    constructor(
        private readonly addStudentRepo: AddStudentRepository,
        private readonly encrypter: Encrypter
    ){}

    async add(student: Student): Promise<Student> {
        const encryptedPassword = this.encrypter.encrypt(student.password)
        
        const newStudent = {
            ...student,
            password: encryptedPassword
        }

        await this.addStudentRepo.add(newStudent)
        return null
    }
}

type SutTypes = {
    sut: AddStudentService
    encrypterMock: EncrypterMock
    repoMock: AddStudentRepositoryMock
}

const makeSut = (): SutTypes => {
    const repoMock = new AddStudentRepositoryMock()
    const encrypterMock = new EncrypterMock()
    const sut = new AddStudentService(repoMock, encrypterMock) // System Under Test
    return {
        sut,
        repoMock,
        encrypterMock
    }
}

const makeFakeStudent = (): Student => ({
    id: "any_id",
    name: "any_name",
    age: 20,
    password: "any_password"
})

describe('add-student-service', () =>{
    it('should call repository with right data', async() =>{
        const {repoMock, sut, encrypterMock} = makeSut()

        await sut.add(makeFakeStudent())

        expect(repoMock.input).toEqual({...makeFakeStudent(), password: encrypterMock.output})
    })

    it('should encrypt password before calling the repository', async() =>{
        const {repoMock, encrypterMock, sut} = makeSut()

        await sut.add(makeFakeStudent())

        expect(repoMock.input.password).toEqual(encrypterMock.output)
    })
})