export default function Errors({errors = []}) {
    return (<div className="mx-4 rounded-lg border-2 border-red-800 my-2 box-border p-2">
    <p>Your response had some errors</p>
    {errors.map((e, i) => <p key={i}>- {e}</p>)}
</div>)
}