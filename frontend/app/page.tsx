"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Vehicle = {
  id: number;
  brand: string;
  model: string;
  registration: string;
  year: number;
  mileage: number;
  status: string;
  image_url?: string | null;
};

type VehicleForm = {
  brand: string;
  model: string;
  registration: string;
  year: string;
  mileage: string;
  status: string;
  image_url: string;
};

const API_BASE_URL = "/api";

const emptyForm: VehicleForm = {
  brand: "",
  model: "",
  registration: "",
  year: "",
  mileage: "",
  status: "available",
  image_url: "",
};

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);

  const [form, setForm] = useState<VehicleForm>(emptyForm);

  function loadVehicles() {
    fetch(`${API_BASE_URL}/vehicles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de récupérer les véhicules");
        }

        return response.json();
      })
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les véhicules.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function refreshVehicles() {
    setLoading(true);
    setError("");
    loadVehicles();
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingVehicleId(null);
    setShowForm(false);
  }

  function startCreate() {
    setForm(emptyForm);
    setEditingVehicleId(null);
    setShowForm(true);
  }

  function startEdit(vehicle: Vehicle) {
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      registration: vehicle.registration,
      year: String(vehicle.year),
      mileage: String(vehicle.mileage),
      status: vehicle.status,
      image_url: vehicle.image_url ?? "",
    });

    setEditingVehicleId(vehicle.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      registration: form.registration.trim(),
      year: Number(form.year),
      mileage: Number(form.mileage),
      status: form.status,
      image_url: form.image_url.trim() || null,
    };

    try {
      const url =
        editingVehicleId === null
          ? `${API_BASE_URL}/vehicles`
          : `${API_BASE_URL}/vehicles/${editingVehicleId}`;

      const method = editingVehicleId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert(
          editingVehicleId === null
            ? "Erreur lors de l'ajout du véhicule"
            : "Erreur lors de la modification du véhicule"
        );
        return;
      }

      resetForm();
      refreshVehicles();
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter l'API.");
    }
  }

  async function deleteVehicle(id: number) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce véhicule ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Erreur lors de la suppression du véhicule");
        return;
      }

      if (editingVehicleId === id) {
        resetForm();
      }

      refreshVehicles();
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter l'API.");
    }
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        vehicle.brand.toLowerCase().includes(searchText) ||
        vehicle.model.toLowerCase().includes(searchText) ||
        vehicle.registration.toLowerCase().includes(searchText);

      const normalizedStatus = vehicle.status.toLowerCase();

      const matchesFilter =
        filter === "Tous" || normalizedStatus === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [vehicles, search, filter]);

  const availableCount = vehicles.filter(
    (vehicle) => vehicle.status.toLowerCase() === "available"
  ).length;

  const rentedCount = vehicles.filter(
    (vehicle) => vehicle.status.toLowerCase() === "rented"
  ).length;

  const maintenanceCount = vehicles.filter(
    (vehicle) => vehicle.status.toLowerCase() === "maintenance"
  ).length;

  function statusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-emerald-100 text-emerald-700";
      case "rented":
        return "bg-amber-100 text-amber-700";
      case "maintenance":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function statusLabel(status: string) {
    switch (status.toLowerCase()) {
      case "available":
        return "Disponible";
      case "rented":
        return "Loué";
      case "maintenance":
        return "Maintenance";
      default:
        return status;
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-bold text-white shadow-lg">
              A
            </div>

            <div>
              <h1 className="text-xl font-bold">AutoManager</h1>
              <p className="text-sm text-slate-500">MecaDrive</p>
            </div>
          </div>

          <button
            onClick={startCreate}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:scale-[1.02]"
          >
            + Ajouter un véhicule
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl md:p-10">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-100">
              Gestion de flotte
            </p>

            <h2 className="mb-3 text-3xl font-bold md:text-5xl">
              Gérez vos véhicules simplement
            </h2>

            <p className="mb-7 max-w-2xl text-blue-100">
              Retrouvez rapidement les véhicules disponibles, loués ou en
              maintenance depuis une interface centralisée.
            </p>

            <div className="flex max-w-2xl items-center rounded-2xl bg-white p-2 shadow-lg">
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle ou une immatriculation..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {showForm && (
          <section className="mb-10 rounded-3xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  {editingVehicleId === null
                    ? "Nouveau véhicule"
                    : "Modification"}
                </p>

                <h3 className="text-2xl font-bold">
                  {editingVehicleId === null
                    ? "Ajouter un véhicule"
                    : "Modifier le véhicule"}
                </h3>

                <p className="text-sm text-slate-500">
                  {editingVehicleId === null
                    ? "Renseignez les informations du nouveau véhicule."
                    : "Modifiez les informations puis enregistrez vos changements."}
                </p>
              </div>

              {editingVehicleId !== null && (
                <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                  ID #{editingVehicleId}
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <input
                required
                placeholder="Marque"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                placeholder="Modèle"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                placeholder="Immatriculation"
                value={form.registration}
                onChange={(e) =>
                  setForm({ ...form, registration: e.target.value })
                }
                className="rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-blue-500"
              />

              <input
                required
                type="number"
                placeholder="Année"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                min="0"
                type="number"
                placeholder="Kilométrage"
                value={form.mileage}
                onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="available">Disponible</option>
                <option value="rented">Loué</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <div className="md:col-span-2">
                <label htmlFor="image_url" className="mb-2 block text-sm font-semibold text-slate-600">
                  URL de l’image (facultatif)
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://exemple.com/vehicule.jpg"
                  value={form.image_url}
                  onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                  aria-describedby="image-url-help"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
                <p id="image-url-help" className="mt-2 text-sm text-slate-500">
                  Une illustration de secours s’affiche si l’image est absente ou indisponible.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01]"
                >
                  {editingVehicleId === null
                    ? "Enregistrer"
                    : "Enregistrer les modifications"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Véhicules"
            value={vehicles.length}
            subtitle="Flotte totale"
            gradient="from-blue-500 to-blue-600"
          />

          <StatCard
            title="Disponibles"
            value={availableCount}
            subtitle="Prêts à être utilisés"
            gradient="from-emerald-400 to-emerald-600"
          />

          <StatCard
            title="Loués"
            value={rentedCount}
            subtitle="Actuellement en location"
            gradient="from-amber-400 to-orange-500"
          />

          <StatCard
            title="Maintenance"
            value={maintenanceCount}
            subtitle="Véhicules à contrôler"
            gradient="from-pink-500 to-rose-600"
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold">Parc automobile</h3>
              <p className="text-sm text-slate-500">
                Consultez et gérez tous les véhicules MecaDrive
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Tous", "Available", "Rented", "Maintenance"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item === "Tous"
                    ? "Tous"
                    : item === "Available"
                    ? "Disponibles"
                    : item === "Rented"
                    ? "Loués"
                    : "Maintenance"}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="py-16 text-center text-slate-500">
              Chargement...
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-50 p-5 text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredVehicles.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center">
              <div className="mb-3 text-5xl">🚗</div>
              <h4 className="text-lg font-bold">Aucun véhicule trouvé</h4>
              <p className="mt-1 text-slate-500">
                Ajoutez votre premier véhicule ou modifiez vos filtres.
              </p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <VehiclePhoto
                  key={vehicle.image_url ?? ""}
                  imageUrl={vehicle.image_url}
                  label={`${vehicle.brand} ${vehicle.model}`}
                />
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-2xl">
                    🚘
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
                      vehicle.status
                    )}`}
                  >
                    {statusLabel(vehicle.status)}
                  </span>
                </div>

                <h4 className="text-xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h4>

                <p className="mt-1 font-mono text-sm text-slate-500">
                  {vehicle.registration}
                </p>

                <div className="my-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Année</p>
                    <p className="font-bold">{vehicle.year}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Kilométrage</p>

                    <p className="font-bold">
                      {vehicle.mileage.toLocaleString("fr-FR")} km
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(vehicle)}
                    className="flex-1 rounded-xl bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="flex-1 rounded-xl bg-rose-50 px-4 py-2.5 font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function VehiclePhoto({ imageUrl, label }: { imageUrl?: string | null; label: string }) {
  const [failed, setFailed] = useState(false);
  let src: string | null = null;

  try {
    const url = new URL(imageUrl?.trim() ?? "");
    if (url.protocol === "https:" || url.protocol === "http:") {
      src = url.href;
    }
  } catch {
    // Missing or malformed URLs use the built-in illustration.
  }

  return (
    <div className="relative mb-5 h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100">
      {src && !failed ? (
        <Image
          src={src}
          alt={`Photo de ${label}`}
          fill
          unoptimized
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
          <svg width="112" height="64" viewBox="0 0 112 64" fill="none" role="img" aria-label={`Illustration de secours pour ${label}`}>
            <path d="M20 30 30 12h44l16 18M12 30h88v24H12z" fill="#c7d2fe" stroke="#6366f1" strokeWidth="3" strokeLinejoin="round" />
            <path d="M36 18h15v12H29zm21 0h13l10 12H57z" fill="#eff6ff" />
            <circle cx="30" cy="52" r="9" fill="#475569" />
            <circle cx="82" cy="52" r="9" fill="#475569" />
            <path d="M16 38h12m56 0h12" stroke="#fff" strokeWidth="5" />
          </svg>
          <span className="text-sm">Photo indisponible</span>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  gradient: string;
};

function StatCard({
  title,
  value,
  subtitle,
  gradient,
}: StatCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-6">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <div className="mt-2 text-4xl font-bold">{value}</div>
        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
