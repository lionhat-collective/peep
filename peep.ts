type Children = string | Partial<View>
type ViewRenderer = (...children: Children[]) => void
type Component = (render: ViewRenderer) => void

const peep = (component: Component): string => {
    let view = ""

    const render: ViewRenderer = (...children: Children[]): void => {
        view = `${view}
        ${children.map(child => {
            if (typeof child === 'string') {
                return child
            } else {
                if (child.render) {
                    return child.render()
                }
                throw new Error(`${child} is not a valid child`)
            }
        }).join("\n")}`.trim()
    }

    component(render)

    return view
}

type View = {
    render: () => string
    class: (className: string) => Omit<View, 'class'>
}

const div = (...children: (string | View)[]): View => {
    return {
        render: () => {
            return `<div>${children.map(child => typeof child === 'string' ? child : child.render()).join("\n")}</div>`;
        },
        class: (className: string) => {
            return {
                render: () => {
                    return `<div class="${className}">${children.map(child => typeof child === 'string' ? child : child.render()).join("\n")}</div>`;
                },
            }
        },
    }
}

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