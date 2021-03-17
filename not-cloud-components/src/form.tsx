import React, { PropsWithChildren } from "react";
import {
  Assert,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  IsType,
  IsUnion,
} from "@paulpopat/safe-type";
import { Icon, IconName } from "./atoms";

const IsFormField = IsObject({
  id: IsString,
  value: IsUnion(IsString, IsNumber, IsBoolean),
});

type FormField = IsType<typeof IsFormField>;
let count = 0;
export function Field(value: string | number | boolean) {
  return { id: (count++).toString(), value };
}

type Form = { [key: string]: FormField | FormField[] };

type Deformed<T extends Form> = {
  [TKey in keyof T]: T[TKey] extends FormField
    ? string | number | boolean
    : (string | number | boolean)[];
};

function Deform<T extends Form>(form: T): Deformed<T> {
  const result = {} as any;
  for (const key in form) {
    const value = form[key];
    if (IsFormField(value)) {
      result[key] = value.value;
    } else if (IsArray(IsFormField)(value)) {
      result[key] = value.map((v) => v.value);
    }
  }

  return result;
}

function DeepSwap<T extends Form>(value: FormField, form: T): T {
  const result = {} as any;
  for (const key in form) {
    const part = form[key];

    if (IsArray(IsFormField)(part)) {
      result[key] = part.map((p) =>
        p.id === value.id ? { id: p.id, value: value.value } : p
      );
    } else if (IsFormField(part)) {
      if (part.id === value.id) {
        result[key] = { id: part.id, value: value.value };
      } else {
        result[key] = part;
      }
    }
  }

  return result;
}

export function CreateForm<T extends Form>(default_value: T) {
  type FormProps = {
    form: T;
    set_form: (v: T) => void;
    submit: (value: Deformed<T>) => void;
  };

  type FormItemProps = {
    for: (form: T) => FormField;
    autocomplete: string;
    validate?: (value: string | number | boolean) => string;
    placeholder?: string;
  };

  type Validator = () => string | undefined;

  const FormContext = React.createContext({
    get: () => ("" as any) as T,
    set: (value: FormField) => {},
    register_validator: (key: string, validator: Validator) => {},
  });

  const validators = {} as NodeJS.Dict<Validator>;

  function BuildElement(props: FormItemProps) {
    const context = React.useContext(FormContext);
    const value = props.for(context.get());
    const [error, set_error] = React.useState("");
    context.register_validator(value.id, () => {
      if (!props.validate) {
        return undefined;
      }

      const result = props.validate(value.value);
      set_error(result);
      return result;
    });

    return { value, context };
  }

  return Object.assign(
    ({ children, submit, form, set_form }: PropsWithChildren<FormProps>) => {
      return (
        <FormContext.Provider
          value={{
            get: () => form,
            set: (value) => {
              set_form(DeepSwap(value, form));
            },
            register_validator: (key, validator) => {
              validators[key] = validator;
            },
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let invalid = false;
              for (const key in validators) {
                const validator = validators[key];
                if (validator && validator()) {
                  invalid = true;
                }
              }

              if (invalid) {
                return;
              }

              submit(Deform(form));
            }}
          >
            {children}
          </form>
        </FormContext.Provider>
      );
    },
    {
      Text: (
        props: PropsWithChildren<
          FormItemProps & { buttons?: { icon: IconName; click: () => void }[] }
        >
      ) => {
        const { value, context } = BuildElement(props);
        const input_value = value.value;
        Assert(IsString, input_value);

        return (
          <>
            <label
              htmlFor={"c" + value.id}
              className="form-label"
              style={{ padding: "0 0.75rem" }}
            >
              {props.children}
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                id={"c" + value.id}
                autoComplete={props.autocomplete}
                className="form-control"
                placeholder={props.placeholder}
                value={input_value}
                onChange={(e) => {
                  const to_input = e.currentTarget.value;
                  context.set({ id: value.id, value: to_input });
                }}
              />
              {props.buttons &&
                props.buttons.map((b, i) => (
                  <button
                    key={i}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => b.click()}
                  >
                    <Icon
                      is={b.icon}
                      colour="light"
                      width="20"
                      height="20"
                      valign="sub"
                    />
                  </button>
                ))}
            </div>
          </>
        );
      },
      InlineText: (props: PropsWithChildren<FormItemProps>) => {
        const { value, context } = BuildElement(props);
        const input_value = value.value;
        Assert(IsString, input_value);

        return (
          <input
            type="text"
            id={"c" + value.id}
            autoComplete={props.autocomplete}
            className="form-control bg-white"
            placeholder={props.placeholder}
            value={input_value}
            onChange={(e) => {
              const to_input = e.currentTarget.value;
              context.set({ id: value.id, value: to_input });
            }}
          />
        );
      },
      Password: (props: PropsWithChildren<FormItemProps>) => {
        const { value, context } = BuildElement(props);
        const [visible, set_visible] = React.useState(false);
        const input_value = value.value;
        Assert(IsString, input_value);

        return (
          <>
            <label
              htmlFor={"c" + value.id}
              className="form-label"
              style={{ padding: "0 0.75rem" }}
            >
              {props.children}
            </label>
            <div className="input-group mb-3">
              <input
                type={visible ? "text" : "password"}
                id={"c" + value.id}
                autoComplete={props.autocomplete}
                className="form-control"
                placeholder={props.placeholder}
                value={input_value}
                onChange={(e) => {
                  const to_input = e.currentTarget.value;
                  context.set({ id: value.id, value: to_input });
                }}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => set_visible(!visible)}
              >
                <Icon
                  is={visible ? "eye-off" : "eye"}
                  colour="light"
                  width="20"
                  height="20"
                  valign="sub"
                />
              </button>
            </div>
          </>
        );
      },
      TextArea: (props: PropsWithChildren<FormItemProps>) => {
        const { value, context } = BuildElement(props);
        const input_value = value.value;
        Assert(IsString, input_value);

        return (
          <div className="mb-3">
            <label
              htmlFor={"c" + value.id}
              className="form-label"
              style={{ padding: "0 0.75rem" }}
            >
              {props.children}
            </label>
            <textarea
              id={"c" + value.id}
              autoComplete={props.autocomplete}
              className="form-control"
              placeholder={props.placeholder}
              rows={5}
              value={input_value}
              onChange={(e) => {
                const to_input = e.currentTarget.value;
                context.set({ id: value.id, value: to_input });
              }}
            />
          </div>
        );
      },
      Select: (
        props: PropsWithChildren<FormItemProps & { multiple?: boolean }>
      ) => {
        const { value, context } = BuildElement(props);
        const input_value = value.value;
        Assert(IsString, input_value);

        return (
          <div className="mb-3">
            <select
              className="form-select"
              aria-label={props.placeholder}
              autoComplete={props.autocomplete}
              value={input_value}
              multiple={props.multiple ? true : undefined}
              onChange={(e) => {
                const to_input = e.currentTarget.value;
                context.set({ id: value.id, value: to_input });
              }}
            >
              <option disabled value="">
                {props.placeholder}
              </option>
              {props.children}
            </select>
          </div>
        );
      },
      Default: default_value,
    }
  );
}

export const FileDrop: React.FC<{ file: (file: File) => void }> = ({
  file,
  children,
}) => (
  <div style={{ position: "relative" }}>
    <input
      type="file"
      multiple
      onChange={(f) => {
        f.preventDefault();
        const files = f.currentTarget.files;
        if (!files) {
          return;
        }

        for (let i = 0; i < files.length; i++) {
          file(files[i]);
        }

        f.currentTarget.type = "text";
        f.currentTarget.type = "file";
      }}
      style={{
        position: "absolute",
        display: "block",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
      }}
    />
    {children}
  </div>
);
