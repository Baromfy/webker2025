# Billiárdterem Időpontfoglaló - Követelmények Teljesítése

Ez a dokumentum részletezi, hogy a projekt hogyan teljesíti a követelményeket, fájlok és sorok szerinti hivatkozásokkal.

## 1. Adatmodell definiálása (legalább 4 TypeScript interfész vagy class formájában)

Az alkalmazás 6 adatmodellt definiál TypeScript interfészekkel:

- **User**: `src/app/models/user.model.ts`
- **BilliardTable**: `src/app/models/billiardTable.model.ts`
- **SnookerTable**: `src/app/models/snookerTable.model.number.ts`
- **TableType**: `src/app/models/tableType.model.ts`
- **Reservation**: `src/app/models/reservation.model.ts`
- **Payment**: `src/app/models/payment.model.ts`

## 2. Reszponzív, mobile-first felület

Az alkalmazás reszponzív tervezést alkalmaz:

- **Login komponens**: `src/app/login/login.component.css` (90-104. sor)
- **Register komponens**: `src/app/register/register.component.css` (143-157. sor)
- **Dashboard komponens**: `src/app/dashboard/dashboard.component.css` (media query-k)
- **Home komponens**: `src/app/home/home.component.css` (reszponzív layout)
- **Általános stilizálás**: Angular Material használata, amely eleve reszponzív komponenseket biztosít

## 3. Legalább 4, de 2 különböző attribútum direktíva használata

Az alkalmazás 4 egyedi direktívát használ:

- **HighlightDirective**: `src/app/directives/highlight.directive.ts`
  - Használata: `src/app/table-card/table-card.component.html` (6. sor - `[appHighlight]="isAvailable ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'"`)

- **TooltipDirective**: `src/app/directives/tooltip.directive.ts`
  - Használata: `src/app/table-card/table-card.component.html` (46-47. sor - `[appTooltip]="'Részletek megtekintése - ' + table.number + '. asztal'" tooltipPosition="top"`)

- **AutoResizeDirective**: `src/app/directives/auto-resize.directive.ts`
  - Használata: `src/app/reservation/reservation.component.html` (textarea elemeken)

- **RippleDirective**: `src/app/directives/ripple.directive.ts`
  - Használata: `src/app/table-card/table-card.component.html` (5. sor - `appRipple` és 53. sor - `appRipple rippleColor="rgba(255, 255, 255, 0.2)"`)

## 4. Legalább 4, de 2 különböző beépített vezérlési folyamat használata (if, switch, for)

Az alkalmazás különböző vezérlési folyamatokat használ a TypeScript kódban:

- **if feltételes logika**:
  - `src/app/reservation/reservation.component.ts` (171-200. sor) - Feltételes ellenőrzések a foglalás létrehozásakor
  - `src/app/dashboard/dashboard.component.ts` (186-194. sor) - `isPastEndTime()` metódus foglalás állapotának ellenőrzésére
  - `src/app/table-card/table-card.component.ts` (70-79. sor) - HostBinding getter metódusok feltételes osztályokkal

- **switch-szerű elágazás**:
  - `src/app/table-card/table-card.component.ts` (105-114. sor) - `getTableIcon()` metódus ahol név alapján választ ikont

- **for ciklusok és iteráció**:
  - `src/app/reservation/reservation.component.ts` (229-243. sor) - Időpontok generálása for ciklussal
  - `src/app/dashboard/dashboard.component.ts` (116-141. sor) - forEach ciklus a táblák adatainak betöltésére

- **komplex feltételes flow Observable láncban**:
  - `src/app/reservation/reservation.component.ts` (171-200. sor) - switchMap operátorok feltételes logikával

## 5. Adatátadás szülő és gyermek komponensek között (legalább 3 @Input és 3 @Output)

Input és Output dekorátorok használata:

- **TableCardComponent** (`src/app/table-card/table-card.component.ts`):
  - @Input() table: Table (20. sor)
  - @Input() tableType?: TableType (21. sor)
  - @Input() isAvailable: boolean (22. sor)
  - @Input() isSelected: boolean (23. sor)
  - @Input() currentReservationCount: number (24. sor)
  - @Output() selectTable = new EventEmitter<Table>() (26. sor)
  - @Output() reserveTable = new EventEmitter<Table>() (27. sor)
  - @Output() viewDetails = new EventEmitter<Table>() (28. sor)

## 6. Legalább 10 különböző Material elem helyes használata

Angular Material elemek használata:

1. **MatCard**: `src/app/login/login.component.html` (2. sor)
2. **MatFormField**: `src/app/login/login.component.html` (12. sor)
3. **MatInput**: `src/app/login/login.component.html` (14. sor)
4. **MatButton**: `src/app/login/login.component.html` (50-56. sor)
5. **MatIcon**: `src/app/login/login.component.html` (15. sor)
6. **MatProgressSpinner**: `src/app/login/login.component.html` (55. sor)
7. **MatSnackBar**: `src/app/login/login.component.ts` (konstruktorban injektálva)
8. **MatExpansionPanel**: `src/app/dashboard/dashboard.component.html` (45. sor)
9. **MatChipSet**: `src/app/dashboard/dashboard.component.html` (48. sor)
10. **MatTabGroup**: különböző nézetek között váltáshoz
11. **MatDatepicker**: `src/app/reservation/reservation.component.html` (63-66. sor)
12. **MatSelect**: `src/app/reservation/reservation.component.html` (73. sor)

## 7. Legalább 2 saját Pipe osztály írása és használata

Két egyedi pipe osztályt implementáltunk:

- **TimeRangePipe**: `src/app/pipes/time-range.pipe.ts` - idő intervallumok formázásához
  - Használata: `src/app/dashboard/dashboard.component.html` (52. sor)

- **FilterTablePipe**: `src/app/pipes/filter-table.pipe.ts` - asztalok szűréséhez
  - Használata: `src/app/reservation/reservation.component.html` (az app-table-card komponens részeként)

## 8. Adatbevitel Angular form-ok segítségével megvalósítva (legalább 4)

Angular Forms használata:

1. **LoginForm**: `src/app/login/login.component.ts` (40-43. sor)
2. **RegisterForm**: `src/app/register/register.component.ts` (51-57. sor)
3. **ReservationForm**: `src/app/reservation/reservation.component.ts` (99-103. sor)
4. **ProfileForm**: `src/app/profile/profile.component.ts` (felhasználói adatok szerkesztése)

## 9. Legalább 2 különböző Lifecycle Hook használata a teljes projektben

Lifecycle hook-ok használata:

- **ngOnInit**:
  - `src/app/dashboard/dashboard.component.ts` (61. sor)
  - `src/app/reservation/reservation.component.ts` (135. sor)
  - `src/app/profile/profile.component.ts`

- **ngAfterViewInit**:
  - `src/app/table-card/table-card.component.ts` 

## 10. CRUD műveletek mindegyike megvalósult legalább a projekt fő entitásához

CRUD műveletek implementálása a Reservation entitáshoz:

- **Create**: `src/app/services/reservation.service.ts` (122-131. sor) - createReservation
- **Read**: `src/app/services/reservation.service.ts` (18-24. sor) - getAllReservations, getReservation
- **Update**: `src/app/services/reservation.service.ts` (134-155. sor) - updateReservation
- **Delete**: `src/app/services/reservation.service.ts` (158-161. sor) - deleteReservation

## 11. CRUD műveletek service-ekbe vannak kiszervezve és megfelelő módon injektálva lettek

Service-ek használata és injektálása:

- **ReservationService**: `src/app/services/reservation.service.ts`
  - Injektálva: `src/app/dashboard/dashboard.component.ts` (57. sor)
  - Injektálva: `src/app/reservation/reservation.component.ts` (96. sor)

- **TableService**: `src/app/services/table.service.ts`
  - Injektálva: `src/app/dashboard/dashboard.component.ts` (58. sor)
  - Injektálva: `src/app/reservation/reservation.component.ts` (95. sor)

- **AuthService**: `src/app/services/auth.service.ts`
  - Injektálva: `src/app/login/login.component.ts` (29. sor)
  - Injektálva: `src/app/reservation/reservation.component.ts` (97. sor)

## 12. Legalább 4 komplex Firestore lekérdezés megvalósítása

Firestore lekérdezések:

1. **Dátum tartomány szerinti lekérdezés**: `src/app/services/reservation.service.ts` (55. sor) - getReservationsByDateRange
2. **Felhasználó szerint szűrés**: `src/app/services/reservation.service.ts` (33. sor) - getReservationsByUser
3. **Táblák rendelkezésre állás ellenőrzése**: `src/app/services/reservation.service.ts` (114. sor) - isTableAvailable
4. **Közelgő foglalások lekérdezése**: `src/app/services/reservation.service.ts` (141. sor) - getUpcomingReservations
5. **Ártartomány szerinti lekérdezés**: `src/app/services/table.service.ts` (69-79. sor) - getTableTypesByPriceRange

## 13. Legalább 4 különböző route a különböző oldalak eléréséhez

Az alkalmazás több különböző route-ot definiál:

- **Home**: `src/app/app.routes.ts` - '/' útvonal
- **Login**: `src/app/app.routes.ts` - '/login' útvonal
- **Register**: `src/app/app.routes.ts` - '/register' útvonal
- **Profile**: `src/app/app.routes.ts` - '/profile' útvonal
- **Dashboard**: `src/app/app.routes.ts` - '/dashboard' útvonal
- **Reservation**: `src/app/app.routes.ts` - '/reservation' útvonal

## 14. AuthGuard implementációja

AuthGuard implementálása:

- **AuthGuard osztály**: `src/app/guards/auth.guard.ts`
- Logika a bejelentkezett állapot ellenőrzésére és a megfelelő átirányításra

## 15. Legalább 2 route levédése azonosítással (AuthGuard)

Route-ok védelme AuthGuard-dal:

- **Profile útvonal**: `src/app/app.routes.ts` - canActivate: [AuthGuard]
- **Dashboard útvonal**: `src/app/app.routes.ts` - canActivate: [AuthGuard]
- **Reservation útvonal**: `src/app/app.routes.ts` - canActivate: [AuthGuard]


