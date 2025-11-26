import React from 'react'
import EmptyState from '../components/shared/EmptyState.jsx'

/**
 * ComingSoon Page
 * 
 * Placeholder for pages not yet implemented
 */
const ComingSoon = ({ pageName = 'This Page' }) => {
  return (
    <EmptyState
      icon="🚧"
      title={`${pageName} Coming Soon`}
      message="This feature is currently under development and will be available soon."
    />
  )
}

export default ComingSoon
