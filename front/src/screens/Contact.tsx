import { useForm, SubmitHandler } from "react-hook-form"

type formInput = {
    subject: string,
    email: string,
    message: string
}

export const Contact = () => {
    const { register, handleSubmit, formState: {errors}} = useForm<formInput>()

    const onSubmit: SubmitHandler<formInput> = data => {
        console.log(data)
    }

    return (
        <div>
            <h3>Contact</h3>


            <p className="mb-10">EMAIL: contact@gmail.com</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="block" htmlFor="subject">Sujet du mail</label>
                <input {...register("subject")} className="border w-50" type="text" name="subject" id="subject" placeholder="Quel est le sujet?"/>

                <label className="block" htmlFor="email">Sujet du mail</label>
                <input {...register("email", {required: true})} className="border w-50" type="text" name="email" id="email" placeholder="Votre email"/>
                {errors.email && <p className="text-[red]">Email requis</p>}



                <label className="block" htmlFor="message">Sujet du mail</label>
                <textarea {...register("message")} rows={5} className="border resize-none" name="message" id="message" placeholder="Votre message"/>
            

                <input type="submit" className="block bg-[yellow] text-[blue] border items-center py-3 px-3 hover:bg-[gray]" name="" id="" />
            
            </form>
        </div>
    )
}