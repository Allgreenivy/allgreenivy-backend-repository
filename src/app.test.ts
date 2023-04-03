import usersRouter from "./routes/userRoute";
import app from './app'
import supertest from "supertest"
const request = supertest(app)
// console.log(request.get);
console.log("here",);




describe("/test", () => {
    it("should return a response", () => {
        return request.get("/test")
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.text).toBe("Hello world");
            })
    })
})

describe("/test", () => {
    it("should return a response", async () => {
        const response = await request.get("/api/test")
        expect(response.status).toBe(200)
        expect(response.text).toBe("Hello world");
    })
})

describe("/test", () => {
    it("should return a response", () => {
        return request.get("/test")
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.text).toBe("Hello world");
            })
    })
})