import { div, peep } from './peep.ts'

const staffMember = ({ name, role }: { name: string, role: string }) => div(
    div(`Name: ${name}`),
    div(`Role: ${role.toUpperCase()}`),
)

const test = peep(component => {
    let x = Math.round(Math.random())

    component(
        div(
            div("Hello world"),
            "Heya"
        ).class("hello-world")
    )

    if (x) {
        component(
            div(
                div("Hello worldx2"),
                "Heyax2"
            ).class("hello-worldx2")
        )
    }

    for (let i = 0; i < 10; i++) {
        component(
            staffMember({ name: `Staff member ${i}`, role: `${i}` })
        )
    }

    component(
        div("Heyo").class("heyo")
    )
})

Deno.writeTextFileSync("peep.html", test)