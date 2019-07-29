import { LoadingSpinner } from '@sourcegraph/react-loading-spinner'
import DotsHorizontalIcon from 'mdi-react/DotsHorizontalIcon'
import React from 'react'
import { RepositoryIcon } from '../../../../../../shared/src/components/icons'
import { RepoLink } from '../../../../../../shared/src/components/RepoLink'
import * as GQL from '../../../../../../shared/src/graphql/schema'
import { isErrorLike } from '../../../../../../shared/src/util/errors'
import { pluralize } from '../../../../../../shared/src/util/strings'
import { GitCommitNode } from '../../../../repo/commits/GitCommitNode'
import { DiffStat } from '../../../../repo/compare/DiffStat'
import { GitCommitIcon } from '../../../../util/octicons'
import { useThreadRepositories } from './useThreadRepositories'

interface Props {
    thread: Pick<GQL.IThread, 'id'>

    showCommits?: boolean

    className?: string
}

const LOADING = 'loading' as const

/**
 * A list of repositories affected by a thread.
 */
export const ThreadRepositoriesList: React.FunctionComponent<Props> = ({ thread, showCommits, className = '' }) => {
    const repositories = useThreadRepositories(thread)
    return (
        <div className={`thread-repositories-list ${className}`}>
            <ul className="list-group mb-4">
                {repositories === LOADING ? (
                    <LoadingSpinner className="icon-inline mt-3" />
                ) : isErrorLike(repositories) ? (
                    <div className="alert alert-danger mt-3">{repositories.message}</div>
                ) : (
                    repositories.map((c, i) => (
                        <li key={i} className="list-group-item">
                            <div className="d-flex align-items-center">
                                <RepoLink
                                    key={c.baseRepository.id}
                                    repoName={c.baseRepository.name}
                                    to={c.baseRepository.url}
                                    icon={RepositoryIcon}
                                    className="mr-3"
                                />
                                <span className="text-muted d-inline-flex align-items-center">
                                    {c.range.baseRevSpec.expr} <DotsHorizontalIcon className="icon-inline small" />{' '}
                                    {c.range.headRevSpec.expr}
                                </span>
                                <div className="flex-1"></div>
                                {!showCommits && (
                                    <small className="mr-3">
                                        <GitCommitIcon className="icon-inline" /> {c.commits.nodes.length}{' '}
                                        {pluralize('commit', c.commits.nodes.length)}
                                    </small>
                                )}
                                <DiffStat {...c.fileDiffs.diffStat} />
                            </div>
                            {showCommits && (
                                <ul className="list-group">
                                    {c.commits.nodes.map((commit, i) => (
                                        <li
                                            key={i}
                                            className="list-group-item border-0 d-flex align-items-start pb-0 px-0 border-left ml-4 pl-4"
                                        >
                                            <GitCommitIcon className="icon-inline mr-3 text-muted" />
                                            <GitCommitNode
                                                repoName={c.baseRepository.name}
                                                node={commit}
                                                compact={true}
                                                className="p-0 flex-1"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}