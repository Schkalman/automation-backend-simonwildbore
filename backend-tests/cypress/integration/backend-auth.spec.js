/*curl 'http://localhost:3000/api/login' 
-H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0' 
-H 'Accept: application/json' 
-H 'Accept-Language: en-US,en;q=0.5' 
--compressed -H 'Referer: http://localhost:3000/login' 
-H 'Content-Type: application/json;charset=UTF-8' 
-H 'Origin: http://localhost:3000' 
-H 'Connection: keep-alive' 
--data-raw '{"username":"tester01","password":"GteteqbQQgSr88SwNExUQv2ydb7xuf8c"}'*/

const LOGIN_URL = 'http://localhost:3000/api/login'

describe('testing auth', function(){
    Cypress.Commands.add('authenticateSession', () => {
        const userCredentials = {
            "username":"tester01",
            "password":"GteteqbQQgSr88SwNExUQv2ydb7xuf8c"
        }
        cy.request({
            method: "POST",
            url: LOGIN_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }).then((response =>{
            expect(response.status).to.eq(200)
            Cypress.env({loginToken:response.body})
        }))
    })

    //Testfall 1, här hämtar jag ett rum (rum 101) och den data som finns om rummet.
    it ('GET', function(){
        cy.authenticateSession().then((response =>{
            cy.request({
                method: "GET",
            url: 'http://localhost:3000/api/rooms',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            }).then(response =>{
                cy.log(response.body[0].id)
                cy.log(response.body[0].created)
                cy.log(response.body[0].category)
                cy.log(response.body[0].floor)
                cy.log(response.body[0].number)
                cy.log(response.body[0].available)
                cy.log(response.body[0].price)
            })
        }))
        
    })
// Testfall 2, här lägger jag till ett nytt rum med olika parametrar.
//  Rummet heter 104.
    it ('POST', function(){
        cy.authenticateSession().then((response =>{
            const payload = {
                "features":["balcony","ensuite","sea_view","penthouse"],
                "category":"double",
                "number":"104",
                "floor":"1",
                "available":true,
                "price":"2000"
            }
            
            cy.request({
                method: "POST",
            url: '	http://localhost:3000/api/room/new',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:payload
            }).then(response =>{
                //cy.log(JSON.stringify(response))
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(payload.number)
            })
        }))
        
    })

//Testfall 3, här ändrar jag priset och tar bort penthouse från features.

    it ('PUT', function(){
        cy.authenticateSession().then((response =>{
            const payload = {
                "features": [
                    "balcony",
                    "ensuite",
                    "sea_view"
                ],
                "category": "double",
                "number": 104,
                "floor": 1,
                "available": true,
                "price": 3000,
                "id": 3,
                "created": "2021-01-06T13:19:35.739Z"
            }
            
            cy.request({
                method: "PUT",
            url: 'http://localhost:3000/api/room/3',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:payload
            }).then(response =>{
                //cy.log(JSON.stringify(response))
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(payload.number)
            })
        }))
        
    })
    
//Testfall 4, här tar jag bort rum 104 helt och hållet.
    it ('DELETE', function(){
        cy.authenticateSession().then((response =>{
            const payload = {
                "features": [
                    "balcony",
                    "ensuite",
                    "sea_view"
                ],
                "category": "double",
                "number": 104,
                "floor": 1,
                "available": true,
                "price": 3000,
                "id": 3,
                "created": "2021-01-06T13:19:35.739Z"
            }
            
            cy.request({
                method: "DELETE",
            url: 'http://localhost:3000/api/room/3',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:payload
            }).then(response =>{
                //cy.log(JSON.stringify(response))
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(payload.number)
            })
        }))
        
    })

    

})