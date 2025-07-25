import { EditProfileForm } from "@/components/fragments/EditProfileForm";
import { useNavigate } from "react-router";

export default function EditProfilePage() {
  const navigate = useNavigate();

  return <EditProfileForm onBack={() => navigate(-1)} />
}
