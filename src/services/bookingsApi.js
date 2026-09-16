/**
 * ============================================================
 * DATA LAYER — the swap point for a real backend.
 * ============================================================
 * Every function in this module is async and returns a Promise.
 * Components never touch Supabase directly; they call these functions.
 */
import { supabase } from '../lib/supabase';

function fromRow(row) {
  const slots = (row.slots || [])
    .map((slot) => String(slot).slice(0, 5))
    .filter((slot, index, all) => all.indexOf(slot) === index)
    .sort();

  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    courtId: row.court_id,
    courtLabel: row.courts?.label || row.court_label || 'Court',
    date: row.booking_date,
    slots,
    hours: row.hours,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    proofFile: row.proof_file,
    status: row.status,
  };
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, created_at, name, phone, email, court_id, booking_date, slots,
      hours, amount, payment_method, proof_file, status,
      courts (id, label)
    `)
    .in('status', ['pending', 'confirmed', 'completed'])
    .order('booking_date', { ascending: true });

  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function createBooking(booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      created_at: booking.createdAt,
      name: booking.name,
      phone: booking.phone,
      email: booking.email || null,
      court_id: booking.courtId,
      booking_date: booking.date,
      slots: booking.slots,
      hours: booking.hours,
      amount: booking.amount,
      payment_method: booking.paymentMethod,
      proof_file: booking.proofFile || null,
      status: 'pending',
    })
    .select('id, created_at, name, phone, email, court_id, booking_date, hours, amount, payment_method, proof_file, status, courts(id, label)')
    .single();

  if (error) throw error;

  return fromRow(data);
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select('id, created_at, name, phone, email, court_id, booking_date, slots, hours, amount, payment_method, proof_file, status, courts(id, label)')
    .single();

  if (error) throw error;
  return fromRow(data);
}