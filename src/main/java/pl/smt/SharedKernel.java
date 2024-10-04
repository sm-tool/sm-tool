package pl.smt;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Jak chcecie iść w bardzo ładną dokumentację, to tu jest definicja adnotacji, tyle że wszystko
 * musicie dawać w pakietach. To jest definicja pakietu shared, do którego idą wszystkie rzeczy
 * wspólne, na necie jest mega dużo sposobów na zarządanie tego, jhipster nawet neż ma swoją
 * dokumentację hexagonal-coś to nazywają. Anyway jak chcecie w to iść, to robicie wszystko
 * pakietowo, jak nie to wywalcie adnotacje i robicie klasycznie
 */
@Target(ElementType.PACKAGE)
@Retention(RetentionPolicy.RUNTIME)
public @interface SharedKernel {
  String name() default "";

  String description() default "";
}
