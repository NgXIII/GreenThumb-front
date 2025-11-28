import {Form} from "react-hook-form";
import {Dialog, DialogContent, DialogTrigger} from "@radix-ui/react-dialog";
import {SquarePen} from "lucide-react";
import {Button} from "@/shared/components/ui/button.tsx";
import React from "react";

export default function EditPassword() {
    return <>
        <Dialog>
            <Form>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        className="bg-orange-50 hover:bg-orange-100 border border-orange-500 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <SquarePen className="text-orange-700" />
                    </Button>
                </DialogTrigger>

                <DialogContent>

                </DialogContent>
            </Form>
        </Dialog>
    </>
}