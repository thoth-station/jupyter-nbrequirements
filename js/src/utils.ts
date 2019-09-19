/**
 * Utilities.
 *
 * A module containing common functions and utilities.
 *
 * @file   A file containing common functions and utilities.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */

export function display(s: any, output: HTMLDivElement): void {
    output.append(`<pre>${JSON.stringify(s, null, 2)}</pre>`)
}

export function dedent(
    strings: string | Array<string>,
    ...values: Array<string>
) {

    // @ts-ignore
    const raw = typeof strings === "string" ? [strings] : strings.raw;

    // first, perform interpolation
    let result = "";
    for (let i = 0; i < raw.length; i++) {
        result += raw[i]
            // join lines when there is a suppressed newline
            .replace(/\\\n[ \t]*/g, "")
            // handle escaped backticks
            .replace(/\\`/g, "`");

        if (i < values.length) {
            result += values[i];
        }
    }

    // now strip indentation
    const lines = result.split("\n");

    let mindent: number | null = null;
    lines.forEach(l => {
        let m = l.match(/^(\s+)\S+/);
        if (m) {
            let indent = m[1].length;
            if (!mindent) {
                // this is the first indented line
                mindent = indent;
            } else {
                mindent = Math.min(mindent, indent);
            }
        }
    });

    if (mindent !== null) {
        const m = mindent; // appease Flow
        result = lines.map(l => l[0] === " " ? l.slice(m) : l).join("\n");
    }

    return result
        // dedent eats leading and trailing whitespace too
        .trim()
        // handle escaped newlines at the end to ensure they don't get stripped too
        .replace(/\\n/g, "\n");
}

export function indent(text: string, indent = 4) {
    const indentation = " ".repeat(indent)

    return text
        .split("\n")
        .map((line) => `${indentation}${line}`)
        .join("\n")
}
