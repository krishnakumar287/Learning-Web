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
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function FormControls({ formControls = [], formData, setFormData }) {
  const [showPassword, setShowPassword] = useState({});
  const [fieldFocus, setFieldFocus] = useState({});
  const [fieldValid, setFieldValid] = useState({});
  const [fieldTyping, setFieldTyping] = useState({});
  const typingTimeoutRef = useRef({});

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
  
  function handleFocus(fieldName) {
    setFieldFocus(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }
  
  function handleBlur(fieldName) {
    setFieldFocus(prev => ({
      ...prev,
      [fieldName]: false
    }));
    
    // Validate field on blur
    validateField(fieldName, formData[fieldName] || "");
  }
  
  function validateField(fieldName, value) {
    let isValid = false;
    
    if (fieldName === "userEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    } else if (fieldName === "password") {
      isValid = value.length >= 6;
    } else if (fieldName === "userName") {
      isValid = value.length >= 3;
    } else {
      isValid = value.trim() !== "";
    }
    
    setFieldValid(prev => ({
      ...prev,
      [fieldName]: value ? isValid : null // null means not validated yet (empty)
    }));
    
    return isValid;
  }
  
  function handleChange(fieldName, value) {
    // Update form data
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    
    // Set typing indicator
    setFieldTyping(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Clear previous timeout
    if (typingTimeoutRef.current[fieldName]) {
      clearTimeout(typingTimeoutRef.current[fieldName]);
    }
    
    // Set new timeout
    typingTimeoutRef.current[fieldName] = setTimeout(() => {
      setFieldTyping(prev => ({
        ...prev,
        [fieldName]: false
      }));
      
      // Validate field after typing stops
      validateField(fieldName, value);
    }, 800);
  }

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const iconElement = getIconByFieldName(getControlItem.name);
    const isFocused = fieldFocus[getControlItem.name];
    const isValid = fieldValid[getControlItem.name];
    const isTyping = fieldTyping[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        // Special handling for password fields
        if (getControlItem.type === "password") {
          element = (
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-indigo-600' : ''}`}>
                {iconElement}
              </div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={showPassword[getControlItem.name] ? "text" : "password"}
                value={currentControlItemValue}
                className={`pl-10 pr-10 transition-all duration-300 ${
                  isFocused 
                    ? 'border-indigo-500 ring-1 ring-indigo-500/30' 
                    : isValid === true 
                      ? 'border-green-500/50' 
                      : isValid === false 
                        ? 'border-red-500/50' 
                        : ''
                } ${isTyping ? 'animate-pulse-subtle' : ''}`}
                onChange={(event) => handleChange(getControlItem.name, event.target.value)}
                onFocus={() => handleFocus(getControlItem.name)}
                onBlur={() => handleBlur(getControlItem.name)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isValid === true && !isTyping && currentControlItemValue && (
                  <CheckCircle className="h-4 w-4 text-green-500 animate-fadeIn" />
                )}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  onClick={() => togglePasswordVisibility(getControlItem.name)}
                >
                  {showPassword[getControlItem.name] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {isValid === false && !isTyping && currentControlItemValue && (
                <p className="text-red-500 text-xs mt-1 ml-1 animate-slideDown">
                  {getControlItem.name === "password" 
                    ? "Password must be at least 6 characters" 
                    : `Invalid ${getControlItem.placeholder}`}
                </p>
              )}
            </div>
          );
        } else {
          element = (
            <div className="relative">
              {iconElement && (
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-indigo-600' : ''}`}>
                  {iconElement}
                </div>
              )}
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                className={`${iconElement ? 'pl-10' : ''} transition-all duration-300 ${
                  isFocused 
                    ? 'border-indigo-500 ring-1 ring-indigo-500/30' 
                    : isValid === true 
                      ? 'border-green-500/50' 
                      : isValid === false 
                        ? 'border-red-500/50' 
                        : ''
                } ${isTyping ? 'animate-pulse-subtle' : ''}`}
                onChange={(event) => handleChange(getControlItem.name, event.target.value)}
                onFocus={() => handleFocus(getControlItem.name)}
                onBlur={() => handleBlur(getControlItem.name)}
              />
              {isValid === true && !isTyping && currentControlItemValue && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500 animate-fadeIn" />
                </div>
              )}
              {isValid === false && !isTyping && currentControlItemValue && (
                <p className="text-red-500 text-xs mt-1 ml-1 animate-slideDown">
                  {getControlItem.name === "userEmail" 
                    ? "Please enter a valid email address" 
                    : getControlItem.name === "userName" 
                      ? "Name must be at least 3 characters" 
                      : `Invalid ${getControlItem.placeholder}`}
                </p>
              )}
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
