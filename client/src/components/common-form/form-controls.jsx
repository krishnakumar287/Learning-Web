import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function FormControls({ formControls = [], formData, setFormData }) {
  const [showPassword, setShowPassword] = useState({});

  function getIconByFieldName(name) {
    switch (name) {
      case "userEmail":
        return <Mail className="h-4 w-4 text-muted-foreground" />;
      case "password":
        return <Lock className="h-4 w-4 text-muted-foreground" />;
      case "userName":
        return <User className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  }

  function togglePasswordVisibility(fieldName) {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  }

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const iconElement = getIconByFieldName(getControlItem.name);

    switch (getControlItem.componentType) {
      case "input":
        // Special handling for password fields
        if (getControlItem.type === "password") {
          element = (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {iconElement}
              </div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={showPassword[getControlItem.name] ? "text" : "password"}
                value={currentControlItemValue}
                className={iconElement ? "pl-10 pr-10" : ""}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => togglePasswordVisibility(getControlItem.name)}
              >
                {showPassword[getControlItem.name] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        } else {
          element = (
            <div className="relative">
              {iconElement && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {iconElement}
                </div>
              )}
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                className={iconElement ? "pl-10" : ""}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
              />
            </div>
          );
        }
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <div className="relative">
            {iconElement && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {iconElement}
              </div>
            )}
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              className={iconElement ? "pl-10" : ""}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="space-y-2">
          <Label htmlFor={controlItem.name} className="text-sm font-medium">
            {controlItem.label}
          </Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
