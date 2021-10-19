type Children = string | Partial<View>

const createView = (): [view: (...children: Children[]) => void, views: () => string] => {
    let views = ""

    const view = (...children: Children[]): void => {
        views += children.map(child => {
            if (typeof child === 'string') {
                return child
            } else {
                if (child.render) {
                    return child.render()
                }
                throw new Error(`${child} is not a valid child`)
            }
        }).join("")
    }

    return [view, () => views]
}

const peep = () => {
    const [view, views] = createView()

    view(
        div(
            div("Hello world"),
            "Heya"
        ).class("hello-world")
    )

    view(
        div("Heyo").class("heyo")
    )

    return views
}

type View = {
    render: () => string
    class: (className: string) => Omit<View, 'class'>
}

const div = (...children: (string | View)[]): View => {
    return {
        render: () => {
            return `<div>${children.map(child => typeof child === 'string' ? child : child.render()).join("")}</div>`;
        },
        class: (className: string) => {
            return {
                render: () => {
                    return `<div class="${className}">${children.map(child => typeof child === 'string' ? child : child.render()).join("")}</div>`;
                },
            }
        },
    }
}

Deno.writeTextFileSync("peep.html", peep()())