import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { variants } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Eye,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface VariantValue {
  id: string;
  variant_id: string;
  value: string;
  locale: string;
  is_active: boolean;
}

interface Variant {
  id: string;
  name: string;
  locale: string;
  is_active: boolean;
  values?: VariantValue[];
}

const VariantsModule: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [variantsList, setVariantsList] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
    values: [""] as string[],
  });

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const { data, error } = await variants.getVariants(language);
      if (error) throw error;
      setVariantsList(data || []);
    } catch (err: any) {
      console.error("Error fetching variants:", err);
      setError(err.message || "Failed to load variants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [language]);

  const handleCreateVariant = () => {
    setFormMode("create");
    setSelectedVariant(null);
    setFormData({
      name: "",
      is_active: true,
      values: [""],
    });
    setIsDialogOpen(true);
  };

  const handleEditVariant = (variant: Variant) => {
    setFormMode("edit");
    setSelectedVariant(variant);
    setFormData({
      name: variant.name,
      is_active: variant.is_active,
      values: variant.values ? variant.values.map((v) => v.value) : [""],
    });
    setIsDialogOpen(true);
  };

  const handleDeleteVariant = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this variant? This will also delete all its values.",
      )
    )
      return;

    try {
      const { error } = await variants.deleteVariant(id);
      if (error) throw error;
      await fetchVariants();
      alert("Variant deleted successfully");
    } catch (err: any) {
      console.error("Error deleting variant:", err);
      alert(`Failed to delete variant: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values
    const filteredValues = formData.values.filter(
      (value) => value.trim() !== "",
    );

    if (filteredValues.length === 0) {
      alert("Please add at least one variant value");
      return;
    }

    try {
      if (formMode === "create") {
        const { error } = await variants.createVariant({
          name: formData.name,
          is_active: formData.is_active,
          values: filteredValues,
          locale: language,
        });

        if (error) throw error;
        alert("Variant created successfully");
      } else {
        if (!selectedVariant) return;

        const { error } = await variants.updateVariant(selectedVariant.id, {
          name: formData.name,
          is_active: formData.is_active,
          values: filteredValues,
          locale: language,
        });

        if (error) throw error;
        alert("Variant updated successfully");
      }

      // Refresh the variants list
      await fetchVariants();

      // Close the dialog
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error saving variant:", err);
      alert(`Failed to save variant: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    setFormData((prev) => ({
      ...prev,
      values: newValues,
    }));
  };

  const addValueField = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, ""],
    }));
  };

  const removeValueField = (index: number) => {
    if (formData.values.length <= 1) return;
    const newValues = [...formData.values];
    newValues.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      values: newValues,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  if (loading) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded my-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.variants.title", "Variants")}
          </h2>
          <Button onClick={handleCreateVariant}>
            <Plus className="mr-2 h-4 w-4" />
            {t("cms.variants.createNew", "Create New Variant")}
          </Button>
        </div>

        {variantsList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t("cms.variants.noVariants", "No variants found")}
            </p>
            <Button onClick={handleCreateVariant}>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.variants.createFirst", "Create your first variant")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.variants.nameColumn", "Variant Name")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.variants.valuesColumn", "Variant Values")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.variants.statusColumn", "Status")}
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    {t("cms.variants.actionsColumn", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {variantsList.map((variant) => (
                  <tr
                    key={variant.id}
                    className={`hover:bg-gray-50 ${!variant.is_active ? "text-gray-400" : ""}`}
                  >
                    <td className="px-4 py-3 border-b">{variant.name}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex flex-wrap gap-1">
                        {variant.values &&
                          variant.values.map((value) => (
                            <Badge
                              key={value.id}
                              variant="outline"
                              className="mr-1"
                            >
                              {value.value}
                            </Badge>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${variant.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {variant.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVariant(variant)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteVariant(variant.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Variant Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Create New Variant" : "Edit Variant"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Add a new variant attribute (like Size, Color) with its possible values."
                  : "Update the variant attribute and its values."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Variant Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Size, Color"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Variant Values</Label>
                  <div className="col-span-3 space-y-2">
                    {formData.values.map((value, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={value}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          placeholder={`e.g. ${
                            formData.name === "Size"
                              ? "Small, Medium, Large"
                              : formData.name === "Color"
                                ? "Red, Blue, Green"
                                : "Value " + (index + 1)
                          }`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeValueField(index)}
                          disabled={formData.values.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addValueField}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Value
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span>{formData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {formMode === "create" ? "Create Variant" : "Update Variant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VariantsModule;
