import { useState } from "react"

const CollapseExpand = ({ expandLabel, collapseLabel, children }) => {
  const [expanded, setExpanded] = useState(false)
  const expandedView = { display: expanded? '' : 'none' }
  const collapsedView = { display: expanded? 'none': '' }
  

  return (
    <div>
      <div style={expandedView}>
        <div>
          {children}
        </div>
        <button style={{ margin: "10px 0" }} onClick={() => {setExpanded(false)}}>{collapseLabel}</button>
      </div>
      <div style={collapsedView}>
        <button style={{ margin: "10px 0" }} onClick={() => {setExpanded(true)}}>{expandLabel}</button>
      </div>
    </div>
    
  )
}

export default CollapseExpand