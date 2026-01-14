import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { logOutFTn } from "@/budget/budgetSlice";
import { useRouter } from "next/navigation";

function LogOutComp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const dispatch = useAppDispatch();
  async function logOutBtnFtn() {
    setIsLoading(true);
    await dispatch(logOutFTn());
    setIsLoading(false);

    router.push("/sign-in");
  }
  return <Button className="cursor-pointer" onClick={logOutBtnFtn}>{isLoading ? "Loading..." : "Log Out"}</Button>;
}

export default LogOutComp;
