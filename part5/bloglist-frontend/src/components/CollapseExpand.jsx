import { useState, useImperativeHandle } from "react"

const CollapseExpand = ({ expandLabel, collapseLabel, children, ref }) => {
  const [expanded, setExpanded] = useState(false)
  const expandedView = { display: expanded? '' : 'none' }
  const collapsedView = { display: expanded? 'none': '' }
  const toggleView = () => {setExpanded(!expanded)}

  useImperativeHandle(ref, () => {
    return { toggleView }
  })

  return (
    <div>
      <div style={expandedView}>
        <div>
          {children}
        </div>
        <button name={collapseLabel} style={{ margin: "10px 0" }} onClick={toggleView}>{collapseLabel}</button>
      </div>
      <div style={collapsedView}>
        <button name={expandLabel} style={{ margin: "10px 0" }} onClick={toggleView}>{expandLabel}</button>
      </div>
    </div>
    
  )
}

export default CollapseExpand