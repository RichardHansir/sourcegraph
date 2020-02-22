import * as path from 'path'
import { dirnameWithoutDot } from './paths'

/**
 * TODO
 *
 * @param root TODO
 * @param documentPaths TODO
 */
export function createBatcher(root: string, documentPaths: string[]): Generator<string[], void, string[]> {
    return traverse(createTree(root, documentPaths))
}

/**
 * TODO
 */
interface Node {
    /** TODO */
    segment: string

    /** TODO */
    children: Node[]
}

/**
 * TODO
 *
 * @param root TODO
 * @param documentPaths TODO
 */
function createTree(root: string, documentPaths: string[]): Node {
    const dirs = Array.from(
        new Set(documentPaths.map(documentPath => dirnameWithoutDot(path.join(root, documentPath))))
    ).filter(dirname => !dirname.startsWith('..'))
    dirs.sort()

    const rootNode: Node = { segment: '', children: [] }

    for (const dir of dirs) {
        if (dir === '') {
            continue
        }

        let node = rootNode
        for (const segment of dir.split('/')) {
            let child = node.children.find(n => n.segment === segment)
            if (!child) {
                child = { segment, children: [] }
                node.children.push(child)
            }

            node = child
        }
    }

    return rootNode
}

/**
 * TODO
 *
 * @param root TODO
 */
function* traverse(root: Node): Generator<string[], void, string[]> {
    let frontier: [string, Node[]][] = [['', root.children]]

    while (frontier.length > 0) {
        const exists = yield frontier.map(([parent]) => parent)

        frontier = frontier
            .filter(([parent]) => exists.includes(parent))
            .flatMap(([parent, children]) =>
                children.map((child): [string, Node[]] => [path.join(parent, child.segment), child.children])
            )
    }
}
