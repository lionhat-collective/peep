export type Children = string | Partial<View>
export type ViewRenderer = (...children: Children[]) => void
export type Component = (render: ViewRenderer) => void

export const peep = (component: Component): string => {
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

export type View = {
    render: () => string
    class: (className: string) => Omit<View, 'class'>
}

export const div = (...children: (string | View)[]): View => {
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