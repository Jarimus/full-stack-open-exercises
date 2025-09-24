const Course = ({course}) => {
    return <>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Sum parts={course.parts} />
    </>
}

const Header = ({name}) => <h2>{name}</h2>

const Content = ({parts}) => {
    return parts.map(part => 
        <Part key={part.id} part={part} />
    )
}

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Sum = ({parts}) => {
    const sum = parts.reduce((s, v) => s + v.exercises, 0)
    return <p>total of {sum} exercises</p>
}

export default Course