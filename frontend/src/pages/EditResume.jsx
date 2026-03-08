import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditResume() {

const { id } = useParams();
const [resume, setResume] = useState({});

useEffect(() => {

const fetchResume = async () => {

const token = localStorage.getItem("token");

const res = await axios.get(
`http://localhost:5000/api/resumes/${id}`,
{
headers: { Authorization: `Bearer ${token}` }
}
);

setResume(res.data.resumeData);
};

fetchResume();

}, [id]);

const handleChange = (e) => {

setResume({
...resume,
[e.target.name]: e.target.value
});

};

const handleSave = async () => {

const token = localStorage.getItem("token");

await axios.put(
`http://localhost:5000/api/resumes/${id}`,
resume,
{
headers: { Authorization: `Bearer ${token}` }
}
);

alert("Resume updated");

};

return (

<div className="max-w-3xl mx-auto py-10">

<h2 className="text-2xl font-semibold mb-6">
Edit Resume
</h2>

<input
name="name"
value={resume.name || ""}
onChange={handleChange}
placeholder="Full Name"
className="border p-2 w-full mb-4"
/>

<input
name="email"
value={resume.email || ""}
onChange={handleChange}
placeholder="Email"
className="border p-2 w-full mb-4"
/>

<textarea
name="summary"
value={resume.summary || ""}
onChange={handleChange}
placeholder="Summary"
className="border p-2 w-full mb-4"
/>

<button
onClick={handleSave}
className="bg-blue-600 text-white px-6 py-2"
>
Save Changes
</button>

</div>

);

}