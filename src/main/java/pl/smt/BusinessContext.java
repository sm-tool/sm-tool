package pl.smt;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * To samo co z sharedContext tylko to jest do zarządzania logiką biznesową, czy chcecie w to iść up
 * to you
 */
@Target(ElementType.PACKAGE)
@Retention(RetentionPolicy.RUNTIME)
public @interface BusinessContext {
    String name() default "Mega super pakiet";

    String description() default "Zawiera bla bla bla bla bla bla";
}
// Ogólnie to jest bardziej po samogenerującą się dokumentacje. można było by to rozbić tak
/*
pl.smt
├── shared
│   ├── @SharedKernel value/objects
│   └── @SharedKernel utils
├── ordermanagement
│   ├── @BusinessContext (Order Management)
│   ├── domain
│   ├── application
│   └── infrastructure
└── authentication
    ├── @BusinessContext (User Authentication)
    ├── domain
    ├── application
    └── infrastructure



 */
