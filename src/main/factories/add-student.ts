import { AddStudentService }            from "../../application/services";
import { UuidIdGenerator }              from "../../infra/providers";
import { BcryptEncrypter }              from "../../infra/providers/encrypter";
import { InMemoryStudentRepository }    from "../../infra/repositories/in-memory/student";
import { AddStudentController }         from "../../presentation/controllers";
import { Controller }                   from "../../presentation/protocols";
import { makeAddStudentValidation }     from "./validators";

export const makeAddStudentController = (): Controller => {
    const repo =        new InMemoryStudentRepository()
    const idGenerator = new UuidIdGenerator()
    const encrypter =   new BcryptEncrypter()
    const service =     new AddStudentService(repo, encrypter, idGenerator)
    const controller =  new AddStudentController(service, makeAddStudentValidation())

    return controller
}